---
layout: post
title: "Weekly Physics Update #2"
date: 2021-09-25
categories: [Physics, C++]
---

Last week I'm a bit ashamed to admit that I haven't gotten much done (this seems to be a recuring theme).
However I believe I am pretty much finished integrating ImGui into the engine, though I haven't tried
building it yet.

Rendering ImGui is a bit difficult to customize since it does require multiple draw calls and splits the
draw data into multiple chunks. I ended up giving up trying to integrate it "properly" and chucked the
code into the rendering backend (GlContext class). I think it's fine anyway since I plan on eventually
replacing ImGui with a home grown solution (which will not be done during the project).

As part of the effort of integrating ImGui, the renderer should also be capable of rendering textured
quads now, allowing for simple 2D games to be built. Again I have yet to test any of this stuff. It is
also of course capable of loading said textures from something like a png file.

The plan for the near future is as follows:
- basic 3D rendering:
	- model loading
	- texture mapping
	- no materials for now
- PhysX / Bullet integration

I also saw this cool Two Minute Papers [video](https://youtu.be/CfJ074h9K8s) talking about rigid body
simulations. I think this would be a very interesting topic to pursue especially seeing as my project
currently lacks focus. So after some basic 3D rendering and PhysX integration I would like to read the
paper, and integrate a simulator.

This week was mostly focused on cleaning up the codebase as it was getting a bit messy. Some improvements
I made were creating convenience classes for resizable arrays and hashmaps. I didn't want to rely on the
C++ standard library so for arrays I used a heap allocated array. Arrays are pretty commonly used so this
ended up getting a bit messy.

The hashmap class is probably a bit too overengineered, although it is still fairly simple. It uses fnv1a
to create hashes, and robin hood hashing (a variant of open addressing) to store the values. Prior to
using robin hood hashing I stored hash collisions in a linked list, which made freeing memory a bit difficult.
Since all the data is stored in a single array, that makes freeing memory far easier. In addition it is more
cache friendly than a linked list. At the moment both classes do not automatically resize. This would be
fairly trival to implement, but was a deliberate decision so that I would still have to be mindful of how
the memory was going to be used. In addition I would like to keep allocations as small as possible.

On this topic, I was thinking about implementing a memory arena. I have watched a few episodes of Handmade
Hero and Casey's technique of allocating one giant block of memory seemed really interesting to me. Using
a memory arena I could almost completely remove the need for memory allocations.

For the implementation, I was thinking that the memory would be split into multiple blocks of memory. When
an object is done with the memory block it would simply be reclaimed by the arena and later reused. This
could be problematic with smaller objects, but this could be remedied by having different sized chunks of
memory. Thread safety would be a bit challenging, but I was thinking each thread could get it's own region
of memory. It would be interesting to implement but for now I don't think I require such a solution.

Since I'm not even sure the code even builds at the moment, unfortunately I do not have any progress images
to show. However this week for sure I will get a screenshot or two.
