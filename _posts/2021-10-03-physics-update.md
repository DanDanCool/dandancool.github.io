---
layout: post
title: "Weekly Physics Update #3"
date: 2021-10-03
categories: [Physics, C++]
---

October already... Time flies in the blink of an eye... I'm going to be honest I didn't do much this week other than
slack off. Rendering ImGui has been rather painful because of all the graphics state it touches:

{% highlight cpp %}
	// Setup render state: alpha-blending enabled, no face culling, no depth testing, scissor enabled, polygon fill
    glEnable(GL_BLEND);
    glBlendEquation(GL_FUNC_ADD);
    glBlendFuncSeparate(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA, GL_ONE, GL_ONE_MINUS_SRC_ALPHA);
    glDisable(GL_CULL_FACE);
    glDisable(GL_DEPTH_TEST);
    glDisable(GL_STENCIL_TEST);
    glEnable(GL_SCISSOR_TEST);
    glDisable(GL_PRIMITIVE_RESTART);
    glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);

	// since imgui touches so much graphics state it has to back everything up to avoid messing with user graphics
    // Backup GL state
    int last_active_texture; glGetIntegerv(GL_ACTIVE_TEXTURE, &last_active_texture);
    glActiveTexture(GL_TEXTURE0);
    int last_program; glGetIntegerv(GL_CURRENT_PROGRAM, &last_program);
    int last_texture; glGetIntegerv(GL_TEXTURE_BINDING_2D, &last_texture);
    int last_sampler; glGetIntegerv(GL_SAMPLER_BINDING, &last_sampler);
    int last_array_buffer; glGetIntegerv(GL_ARRAY_BUFFER_BINDING, &last_array_buffer);
    int last_vertex_array_object; glGetIntegerv(GL_VERTEX_ARRAY_BINDING, &last_vertex_array_object);
    int last_polygon_mode[2]; glGetIntegerv(GL_POLYGON_MODE, last_polygon_mode);
    int last_viewport[4]; glGetIntegerv(GL_VIEWPORT, last_viewport);
    int last_scissor_box[4]; glGetIntegerv(GL_SCISSOR_BOX, last_scissor_box);
    int last_blend_src_rgb; glGetIntegerv(GL_BLEND_SRC_RGB, &last_blend_src_rgb);
    int last_blend_dst_rgb; glGetIntegerv(GL_BLEND_DST_RGB, &last_blend_dst_rgb);
    int last_blend_src_alpha; glGetIntegerv(GL_BLEND_SRC_ALPHA, &last_blend_src_alpha);
    int last_blend_dst_alpha; glGetIntegerv(GL_BLEND_DST_ALPHA, &last_blend_dst_alpha);
    int last_blend_equation_rgb; glGetIntegerv(GL_BLEND_EQUATION_RGB, &last_blend_equation_rgb);
    int last_blend_equation_alpha; glGetIntegerv(GL_BLEND_EQUATION_ALPHA, &last_blend_equation_alpha);
    int last_enable_blend = glIsEnabled(GL_BLEND);
    int last_enable_cull_face = glIsEnabled(GL_CULL_FACE);
    int last_enable_depth_test = glIsEnabled(GL_DEPTH_TEST);
    int last_enable_stencil_test = glIsEnabled(GL_STENCIL_TEST);
    int last_enable_scissor_test = glIsEnabled(GL_SCISSOR_TEST);
    int last_enable_primitive_restart = glIsEnabled(GL_PRIMITIVE_RESTART);
{% endhighlight %}

I ended up giving up trying to integrate it natively and just used the included backend for rendering. I've disabled
multi-viewports because that would be additonal work (and headache) and I plan to write my own solution for UI in the
future. Past the headache of trying to integrate it directly (it is much easier to just use the included backends) imgui
is powerful and easy to use.

The renderer is also capable of rendering some 2D textures, and I've written some demo imgui code since I promised
screenshots last week:

![imgui no docking](/assets/images/imguinodocking.png)
![textured quads](/assets/images/texturedquads.png)
![color picker](/assets/images/colorpicker.png)
![moving quads](/assets/images/movingquads.png)
![color picker 2](/assets/images/colorpicker2.png)
![color picker 3](/assets/images/colorpicker3.png)

At this point I can pretty much make a simple 2D game. All I would need to do is serialize and deserialize scenes (which
will probably be implemented in the future), implement a scene graph, and work on some additional UI. Since that sounds
like a lot of work I am not going to pursue the idea for now. As per the plan from last week I am going to be working on
some basic 3D rendering and move forward to physics engine integration. I kind of want a break from programming the
engine so I think I'll do some research into my options for physics simulations.
