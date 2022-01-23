---
layout: post
title: "Physics Update: Afterthoughts"
date: 2022-01-07
categories: [Physics]
---

New year new... physics post. I have not made a physics post since last October, which is a bit spooky. Needless to say,
I think I'm going to drop the "weekly" from the title of these posts. Especially since this is going to be the last one.
I have a couple of things in mind to discuss: development, improvements, and regrets.

Of course, physics has been integrated successfully, though not in a way I would like. I will refrain from providing
reasons here, since the reasons are more technical. I have also implemented a simple scene serializer so that scenes can
be saved and loaded without any hardcoding. Something a bit funky that might be noticed in the simulation is the
lighting. When the objects rotate it appears that the lighting also rotates with it. This is actually the case. The
diffuse lighting is calculated using the surface normals, which are prebaked into the model information. The surface
normals are relative to the object itself, and do not take into account the rotation of the object. A special
transformation matrix has to be constructed to transform the surface normals, however this would mean more work so I
opted to leave it as is. Another quick thing to mention: the engine was compiled in "debug" mode with zero
optimizations. For something intended to be used by the public, it would be better to compile it in "release" mode with
performance optimizations. This would be more indicative of real world performance, as debug builds can be significantly
slower than release builds. Such performance problems were encountered in one of the test cases.

Something I quickly encountered while doing some basic experiments on the physics simulation was that it wasn't very
realistic. For elastic collisions, energy was not always conserved. When an inelastic collision occured, objects did not
"stick together" as expected. An unfortunate aspect of the experiments is that the results were always analyzed using
theoretical knowledge learned in the classroom. Real world experiments were not possible barring the most simplest of
experiments. However, a baseline would have been nice to compare the results to. Such a baseline could have been
provided by other simulations designed for accuracy, such as Houdini or MuJoCo. Something I was unsure about was the
inclusion of constraints. While this would have been interesting to see in action, there is no obvious parallel to the
concepts learned in physics class.

A major regret I have about this project is that it was far too computer science focused. Browsing through my last few
blog posts, it is clear that I have spent more time on the technical aspects rather than the physics aspects. In fact,
integrating the physics engine as well as serializing and deserializing scenes took about 1-2 weeks of work. This stems
from my original motivations of choosing this topic: I enjoy developing game engines, and so I saw the physics project
as an opportunity to further develop the engine and integrate physics simulation into it. However, I believe that this
mindset harmed the project more than it helped. While it is good to do something that is enjoyable, that can lead to
loss of focus. In my case, this resulted in the squandering of time performing unrelated tasks. If I were to restart the
project from scratch, I would not bother spending the time of writing the engine from scratch. The engine is not the
project, the physics simulation is, and that's what should have been the focus in the first place. For graphics, I would
use the OGRE3D rendering engine, which already has extensive graphics support. This would have allowed me to focus on
integrating the physics and designing better experiments. An improvement I would make would be to integrate the MuJoCo
physics engine. Unlike Bullet, MuJoCo was designed with robotics in mind, and therefore would yield more accurate
results.

However, I would like to make clear that I think the experience was still valuable. First of all, I will not say that
the experience strengthened my physics knowledge. The concepts that were being tested were very simple and intuitive in
my opinion. The experience was my first exposure to physics simulations, something I had no prior experience with. In
addition, I found many shortcomings in my engine while I was integrating the physics simulation. Something I likely
would not have noticed had I continued working on it regularly. I also wrote a bunch of lab reports for the experiments
I did. While I don't know if they are the best quality, I suppose you cannot improve if you never try in the first
place. On that note, this concludes my final physics post. Resources can be found
[here](https://drive.google.com/drive/folders/1XHieIjOjXkoAHKi-iyGwWhhXnbHUHf9c). I might consider putting the assets on
the site, but that depends on how industrious I'm feeling (I am not feeling very industrious at the moment, if you are
wondering).
