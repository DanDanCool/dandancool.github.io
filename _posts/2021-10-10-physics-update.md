---
layout: post
title: "Weekly Physics Update #4"
date: 2021-10-10
categories: [Physics, C++]
---

Nothing major happened this week. Mostly just work for loading models and 3D rendering. It's become clear to me that on
school nights I can't get much work done due to schoolwork and such, leaving the only guaranteed opportunities for
development on weekends. I should probably lower my expectations of what I can accomplish in a week. I also decided
that [bullet physics](https://github.com/bulletphysics/bullet3) would be integrated over PhysX. There are a couple of
reasons:<br>
- PhysX 5.0 was announced quite a while ago but was never released
- The development of Bullet is more traditionally FOSS, new features are added directly to the repository
- PhysX hardware acceleration uses CUDA, which is only available for Nvidia GPUs, which I don't have access to

I also found an interesting use case for physics simulations while reading [this
paper](https://homes.cs.washington.edu/~todorov/papers/ErezICRA15.pdf).  Robotics is an interesting field to look into.
Using physics simulations for desiging robots can be much faster and cheaper than building a physical prototype. I also
have a friend who is the lead programmer for the school robotics team so I can ask him for more details.

Back to rendering: for model loading I use a library called
[tinyobjloader](https://github.com/tinyobjloader/tinyobjloader). A small library like tinyobjloader is more desirable
over a larger library like assimp in my opinion because it's more easily customizable and extensible. The downside is
that I'm limited to loading only obj files. I considered the benefits of using something more feature rich like Collada,
but Collada uses xml, and I hate xml. The wavefront obj file format is simple and human readable, which is a huge plus
in my opinion. That being said, I have some dislikes of tinyobjloader. The library uses STL (which I'm not a fan of),
and according to [vulkan-tutorial](https://vulkan-tutorial.com/Loading_models) seems to be slow in debug builds. In
addition, the code can be simplified quite a bit and optimized for my use case. By triangulating and exporting my
Blender models into an obj file, I can directly take the vertex coordinates and stick that in my vertex buffer. Using
some basic processing, the faces section can be put into an index buffer. The good thing is that it's pretty simple (~3k
loc), and would be trivial to rewrite.

Another thing that I required was a perspective projection matrix. By multiplying the projection matrix with the
vertices in a scene, you can get a perspective effect. Another type of projection matrix is an orthographic projection
matrix. This is typically used in 2D games. The basic difference is that for two identically sized objects, at different
distances, the orthographic projection will make them appear the same size, while the perspective projection will make
them appear different sizes (like real life).

While implementing it, I saw that the GLM implementation of the perspective projection uses the standard library
implementation of tan. Looking for some better alternatives, I looked for a hardware implementation of it. However,
according to Agner Fog's [Instruction Tables](https://agner.org/optimize/instruction_tables.pdf), they each take roughly
100+ cycles each. That's surprisingly slow for a hardware instruction. Doing some research, I found that a technique
called CORDIC is used for calculating the trigonometric functions. These functions are hard to calculate since the
trigonometric functions are transcendental functions, and the implementation prefers accuracy over speed.

After some further searching, I found the secret sauce: Chebyshev Polynomials. These functions are similar to Taylor
Polynomials except they yield much better results. I found this nifty [tool](https://github.com/samhocevar/lolremez)
which can find the coefficients for me, and I mostly followed their tutorial for finding polyomials to approximate the
trig functions. This topic is surprisingly obscure. The tool uses Remez algorithms to calculate the coefficients for the
polyomials. The only other free alternative is some tool in the boost library. Outside of that you have to use Maple or
Mathematica.

Sine was pretty easy to get a polynomial for. According to the tutorial, you can make sure the algorithm finds a odd or
even function by manipulating the input function to approximate and the weight function. Finding a polynomial for cosine
is a similar process. We take advantage that an even function (like cosine) P(x) can be written in the form Q(x^2) where
Q has the same coefficients. We can then do a change of variable and get: |cos(y^0.5) - Q(y)| = E. One more thing: we
actually have to pass in x^2 to get the correct result. It turns out that when we simplify the equation, we do one less
multiply and addition when compared to a polynomial of the same order of sine. We can trade this speed benefit and find
a higher order polynomial so that the performance of cosine and sine are equal, but the error is greatly reduced.

Calculating the tangent function is a lot more difficult. Plotting it on a graph, we see that as the angle approaches
pi/2, the function curves really hard.This is pretty difficult to approximate with a polynomial, so I'm fresh out of
luck. Something I could do is take advantage of the identity<br>
tan(x) = sin(x) / cos(x)<br>
However there are two problems: performance and accuracy. The sin and cos function are already approximated, so the
error is twice as large. In addition, I pay for the cost of calculating both sine and cosine, and on top of that I have
to do a division, which is slow. However it's still faster than the hardware implementation. After doing some more
research, I came across [this presentation](https://basesandframes.wordpress.com/2016/05/17/faster-math-functions/)
given in 2003 about faster trigonometric functions for the PlayStation 2 targeted at game programmers (perfect). In the
presentation it gives a pretty convoluted way to calculate tangent. I take a more simpler approach in my implementation,
I use the identity<br>
tan(x) = cot(pi / 2 - x)<br>
Instead of trying to approximate tangent, we try to approximate cotangent instead. The presentation points out an
excellent starting point: when x is near 0, cot(x) is very similar to the reciprocal function 1 / x. So we try to find
some polynomial to add to the reciprocal function to approximate cot(x). We can find this polynomial by telling the
algorithm to approximate cot(x) - 1 / x. In addition, since the function should be odd, we can take the same trick used
for calculating sine and apply it here. I still pay for the cost of division, but calculating this polynomial is faster
than the alternative of sin(x) / cos(x). The limitation of this approach compared to the approach offered in the
presentation is that as x approaches pi/2, the error increases. However it's acceptable for my use cases so I don't
really care.

In conclusion, we should get an implementation that looks like this:

{% highlight cpp %}
    float Sin(float x)
    {
        float x2 = x * x;

        float u = -1.8363654e-4f;
        u = u * x2 + 8.3063252e-3f;
        u = u * x2 + -1.6664828e-1f;
        u = u * x2 + 1.0f;

        return x * u;
    }

    float Cos(float x)
    {
        float x2 = x * x;

        float u = 2.3153932e-5f;
        u = u * x2 + -1.3853704e-3f;
        u = u * x2 + 4.1663585e-2f;
        u = u * x2 + -4.9999905e-1f;

        return u * x2 + 1.0f;
    }

    float Tan(float x)
    {
        uint32_t bits = *(uint32_t*)&x;
        uint32_t sign = bits & 0x80000000;
        bits = bits & 0x7fffffff;

        float t = PI_2 - *(float*)&bits;
        float t2 = t * t;

        float u = -4.6290783e-5f;
        u = u * t2 + -1.394454e-4f;
        u = u * t2 + -2.201409e-3f;
        u = u * t2 + -2.2182439e-2f;
        u = u * t2 + -3.333385e-1f;
        u = (1.0f / t) + t * u;

        bits = *(uint32_t*)&u;
        bits = bits | sign;

        return *(float*)&bits;
    }
{% endhighlight %}

A couple things to note. We have to strip the sign bit of the float before calculating the tangent, we then add the sign
bit back after we calculate the tangent (tan(-x) = -tan(x), tan is an odd function).

After doing all this work, I realized that this tangent is only used in the perspective projection matrix calculation.
The projection matrix is extremely unlikely to require recalculation, so it doesn't matter if it's a more expensive
operation. The standard implementation of tan would have been totally fine. I can't think of anywhere to apply these
trigonometric functions either, so they're kind of useless too. I would say at least going through the process of
learning about Remez approximation was beneficial, but I also can't think of of any applications for it. I guess it's
obscure for a reason. On top of that, I'm pretty tired.
