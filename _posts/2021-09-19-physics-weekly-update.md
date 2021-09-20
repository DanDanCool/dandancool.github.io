---
layout: post
title: "Weekly Physics Update #1"
date: 2021-09-19
categories: [Physics, C++]
---

From this point forward I'm going to make weekly updates on my physics project as per the project
guidelines.

This week I'm a bit ashamed to say I haven't accomplished much. This week I've been integrating
Dear ImGui into the engine. Doing this is more difficult than normal since I can't just use the
provided backends. This is because when I first started out writing the engine (which was before
the physics fair was even announced) I wanted to write everything from scratch. Obviously because
of time constraints this isn't feasible now, but I would still like to write as much stuff from
scratch as I can.

Integrating ImGui involves giving it window state such as which keys were pressed, where did the
mouse move, etc. Unfortunately I haven't implemented this yet as I was planning to do this later
as this requires a bit of work. As of writing I have implemented keyboard input but not mouse
input. The majority of the next week will probably be focused on writing input code.

The second part of integrating ImGui is providing rendering. I haven't taked a serious look at this
yet but from the looks, it should be fairly trivial to implement rendering. Fortunately my job of
integrating ImGui is made a bit easier by my deliberate decision to not support a couple of features
(such as multiple viewports).

The good news is that after integrating ImGui I should be able to finish the 2D renderer, and from
there I can start working on the 3D renderer. My plans for 3D rendering are fairly simple. I won't
be implementing ray-tracing or anything fancy (I don't have a compatible GPU).

3D rendering of course requires 3D models. To load these models I will probably use a third-party
library to speed things up.

Another problem that I will have to tackle in the future are scenes. To do anything interesting with
physics I will probably want a semi-complex scene with lots of moving parts. I already have something
basic implemented in the form of an entity-component-system. However I would preferably like to save
scene information to a file so that it can be reused in the future.

I would like to post a demo of the engine so far but it is currently broken due to development work.
