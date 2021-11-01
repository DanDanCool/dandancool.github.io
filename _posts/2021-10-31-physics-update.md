---
layout: post
title: "Weekly Physics Update #5"
date: 2021-10-31
categories: [Physics, C++]
---

It's been three weeks since my last physics update. There were a couple of important assignments that popped up here and
there but needless to say: I was slacking off. However, I'm pretty much done all the groundwork for the engine and I am
almost ready to integrate the physics engine (the source code was copied in but it's been sitting there since). Before
discussing further, I would like to recap what has been done, talking a bit about research, and future plans.

Probably one of the most important things in a 3D scene is the camera. In general, graphics APIs such as Vulkan,
DirectX, and OpenGL don't have any concept of this. So to simulate a camera, we use a matrix to move everything around
the camera. The camera is quite literally our frame of reference. When the camera moves left, we show this my moving
everything right (this is like relative motion). This is the basis for the look-at algorithm. To be honest I don't know
*exactly* how the math works but I can give a quick rundown on how the algorithm works.

The transformation has two parts. The first part is what I mentioned above: we want to translate the entirety of the
scene the opposite way we move. This can be done using a simple translation matrix. Something we would like to do with
the camera is not just move around, but also **look** around. We can use Euler angles to do so (yaw, pitch, roll), roll
is rarely used, and that is a good thing because the look-at algorithm actually doesn't support roll (without
modification). We then use these angles to calculate the direction the camera is looking at. Using the direction vector,
we want to calculate two other orthonormal 'right' and 'up' vectors. The intuition for this is that when we look down,
everything else can be considered to be 'rotating' upwards. When we look left, everything 'rotates' to the right. So
what we want to do is rotate everything the opposite direction by the camera's Euler angles. If we create an orthogonal
matrix with our direction, right, and up vector, we get a transformation matrix that rotates the entire scene by our
Euler angles. The inverse of the matrix is therefore the matrix we want. Since our matrix is orthogonal, we can get the
inverse by transposing the matrix. The code looks something like this:

{% highlight cpp %}
// calculate the direction the camera is looking at
Vec4 direction;
direction.x = Cos(camera.Yaw * RADIANS) * Cos(camera.Pitch * RADIANS);
direction.y = Sin(camera.Pitch * RADIANS);
direction.z = Sin(camera.Yaw * RADIANS) * Cos(camera.Pitch * RADIANS);

// get our orthonormal vectors, see Gram-Schmidt method
Vec4 d = Normalize(direction);
Vec4 r = Normalize(Cross(d, Vec4(0.0f, 1.0f, 0.0f, 0.0f)));
Vec4 u = Cross(r, d);

Mat4 lookat;
lookat[0].x = r.x;
lookat[1].x = r.y;
lookat[2].x = r.z;
lookat[0].y = u.x;
lookat[1].y = u.y;
lookat[2].y = u.z;
lookat[0].z = -d.x;
lookat[1].z = -d.y;
lookat[2].z = -d.z;
lookat[3].x = -Dot(r, camerapos);
lookat[3].y = -Dot(u, camerapos);
lookat[3].z =  Dot(d, camerapos);
{% endhighlight %}

Brief note on how the direction vector is calculated. Focus on the xz plane first. Imagine a right triangle with
hypotenuse of length 1 and the angle between the hypotenuse and the x-axis being the camera's yaw. If we consider the
hypotenuse a vector, then it's components would be [cos(yaw), 0, sin(yaw)]. From a similar process, the hypotenuse
vector of the triangle on the xy plane would be [cos(pitch), sin(pitch), 0]. Since the x component is affected by the
pitch, we have to multiply each component of the xz vector by the cosine of the pitch. Another quick thing: we want to
clamp the pitch in between -89 and 89. In the cross product we use the direction and the y-axis to get the right vector.
If the pitch is equal to 90 then there is no solution for the cross product. This is probably for the best as things can
get a bit wonky if you are allowed to look beyond that angle.

We also directly set the 4th column of the matrix to be the dot product between the orthonormal vectors and the
camera position. Mathematically this is equivalent, and saves us some computation time. Intuitively, you can think of
this as 'projecting' the position vector onto the vectors.

You may also have noticed we use 4x4 matrices and 4 element vectors. This may be somewhat confusing, however we need the
fourth column for affine transformations. Generally, the fourth row of a matrix is never touched. Since we can't
multiply 3 component vector's with a 4x4 matrix, I typically use 4 component vectors. The cross and dot functions treat
the vector as a 3 component vector, so there's no problems there either. The 'w' component of a vector also has meaning.
It is called the 'homogenous' coordinate, and it helps differentiate whether a vector is a direction or a position. When
it is a position, it is set to 1, when it is a direction it is set to 0. This has an interesting effect when multiplying
vectors with matrices, a position will be translated, however since a direction has it's w component set to 0, it will
not be affected by transformations. One more very useful property of a 4 element vector is that it fits perfectly into a
xmm register for simd operations (but more on that later).

I did initally have some funky results with the algorithm, this turned out to be due to my inverse square root function
in the normalization. It was using sse instructions for calculating the square root instead of the inverse square root
(`_mm_sqrt_ss` and `_mm_rsqrt_ss`). Speaking of sse, I did have some fun with intrinsics implementing some conditionless
moves. Admittedly, these were micro-optimizations. I didn't even bother writing the linear algebra operations using simd
either, which is what would benefit the most. SIMD stands for single instruction multiple data, and has been present on
pretty much all cpu chips for 20 odd years. Like the name suggests, they allow for data to be processed in parallel
using some special silicon. Each simd instruction is as fast (or faster) as the corresponding x87 instruction, but you
can potentially process more data so it's basically free performance.

Remember the Chebyshev polynomials from last week? Turns out I only approximated across the interval [-90, 90]. This is
unfortunate since I didn't get the full range of the values from sine and cosines (speaking of which, they're finally
being used by the camera!). I was a bit vague last time so I'll go more in depth here. The sine function is an odd
function, so preferably we want an odd polynomial to approximate it. Let's call this polynomial P(x). Therefore there
must be some polynomial Q(x) where P(x) = x * Q(x^2). The coefficients for each term will be equivalent (the
coefficients are what we really want). We want to solve the expression |sin(x) - x * Q(x^2)| to minimize the difference.
To make the tool happy, we have to rearrange the expression: |sin(sqrt(x)) / sqrt(x) - Q(x)| / (1 / sqrt(x)). Therefore
Q(x) is an approximating polynomial for sin(sqrt(x)) / sqrt(x), and 1 / sqrt(x) is the weight function to make sure that
the error across the interval remains somewhat the same. since sin is odd we can restrict the interval to [0, 90]. Also
note that we are taking the square root of x, so we have to expand the interval to [0, 90^2]. Also we can't divide by
zero, so we just use something pretty close to zero: [1e-50, 90^2]. Something to notice is that the first coefficient is
really close to 1. However if we set it to 1 directly it is really bad for our error. We would like to set it to 1 since
that's one less constant the cpu has to load. So what we want to find is some R(x), where Q(x) = 1 + x * R(x). R(x) is a
polynomial that is one degree lower than Q(x). Substituting this into our expression, and then reorganizing it so that
the tool is happy, we get: |(sin(sqrt(x)) - sqrt(x)) / (x * sqrt(x)) - R(x)| / (1 / (x * sqrt(x))).

![sine approximation](/assets/images/sinapprox1.png)
![sine approximation](/assets/images/sinapprox2.png)
Blue: Naive Approach, Purple: Better Approach

The process is similar for cosine. Cosine is an even function so we want an even polynomial to approximate it. Let's
call this polynomial P(x). There must be some polynomial Q(x) such that P(x) = Q(x^2). Substituting into the expression
we get: |cos(x) - Q(x^2)|. We want to get rid of that power, so we square root everything: |cos(sqrt(x)) - Q(x)|. The
approximation for this yields a constant term close to 1, so preferably we would want to set the constant term to 1. So
by similar process, we find R(x) where Q(x) = 1 + x * R(x), where R(x) is a polynomial that is one degree lower than
Q(x). Substituting and reformatting, we get: |(cos(sqrt(x)) - 1) / x - R(x)| / (1 / x). Where 1 / x is the weight
function. Interestingly, the results aren't that much better than the naive method, but it doesn't cost extra
computationally so whatever.

![cosine approximation](/assets/images/cosapprox1.png)
![cosine approximation](/assets/images/cosapprox2.png)
Blue: Naive Approach, Purple: Better Approach

After getting the camera working, we kind of have a 3D scene. However looking at squares in 3D space isn't really
interesting, so we want to load in some more interesting 3D models. With tinyobjloader this was kind of trivial if you
only need the vertex positions. However you probably want stuff like normal vectors for lighting equations, so that
makes processing the vertex information a tad bit more annoying. If you only need vertex positions you can directly copy
the vertex information and use the provided vertex indices. Since a normal vector may be used across multiple vertex
positions, or a vertex position may be used several times with different normal vectors, we kind of have to use each
combination that comes up. This kind of sucks because we use more gpu memory and we have to use a hash map to store
unique vertices.

![3D models](/assets/images/Model1.png)
![3D models](/assets/images/Model2.png)
![3D models](/assets/images/Model3.png)
Some exciting 3D models such as the 2D plane and cube!

Like I mentioned, I wanted the normal vectors for some basic lighting. I found that using a flat colour for lighting
kind of made it hard to see the individual faces of the model. Lighting is a really interesting field and could be it's
own physics investigation itself. Since solving lighting is impossible (light can bounce around infinite times) I used a
simplified model for lighting, called Phong shading. Phong shading has three components: specular, diffuse, and ambient.
The specular component is the 'highlight' you see on some objects. The diffuse component tells you how perpendicular the
surface is to the light source (I don't know how to describe this in a better way). Since light can bounce around an
infinite amount of times, we lose energy when we don't consider it. The ambient component injects some of the lost
energy back into the system. It's the most unrealistic part of the model, and doesn't really have any scientific basis
for it. The ambient component is just an arbitrary scalar basically. I only implemented the diffuse and ambient
component since I was lazy and thought that was good enough. Like I mentioned, the smaller the angle between the
incoming light ray and the normal vector the more bright the surface is. If you hold up a light directly above your
table it's going to be pretty bright, but if you hold it to the side or something it's going to be more dim. We can use
the dot product to calculate this.

![Lighting](/assets/images/Lighting1.png)
![Lighting](/assets/images/Lighting2.png)
![Lighting](/assets/images/Lighting3.png)
Basic diffuse lighting with a singular light

I also did some brief reading into physics engines. The peer assigned to me to assess my physics project linked some
very good resources: [one](https://www.toptal.com/game/video-game-physics-part-i-an-introduction-to-rigid-body-dynamics)
and [two](https://www.youtube.com/watch?v=zzy6u1z_l9A). I already knew about collision, however the part about
constraints were very interesting. In addition the techniques used were interesting to read about.

I would also like to do some labs using the physics engine. The simulation results would be compared to a real life
experiments. I think it would also be an interesting application of the kinematics we learned in class.

At this point in time the engine is pretty much ready for physics to be integrated. However I would like to take some
time to do some maintenance and evaluate the codebase. I know for a fact that I did a lot of hacky things to get things
up and running, and I would like to clean that stuff up. I think the codebase is long overdue for some review, my hope
is that physics integrations is made simpler because of it. I would also like to look at some other game engines like
cryengine and unreal engine for some 'inspiration.' I also need to take a look at the bullet3 docs to get a sense of
what I need to do to integrate the physics engine.
