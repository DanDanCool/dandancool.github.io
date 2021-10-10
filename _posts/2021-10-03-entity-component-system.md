---
layout: post
title: "Entity Component System Implementation Using Sparse Tables"
date: 2021-10-03
categories: C++
---

In my [last physics update]({% post_url 2021-10-03-physics-update %}), I briefly talked about scenes. I think an
interesting part of game engines is how you store the data in the scenes. A popular technique is to use an **Entity
Component System (ECS)**. An entity in the game world might be a player, or an enemy, or a box. The entity has data for it's
position, model, etc. and logic to control movement, input, etc. In an ECS an entity is nothing more than a handle, made
up of it's various components. This is preferable to having a wide class hierarchy as code can be reused more easily. To
illustrate this point let's consider 10 different components. The amount of different "entities" that can be made from
these components is:<br>
C(10, 10) + C(10, 9) + C(10, 8) ... + C(10, 1)<br>
It would be very difficult to implement this using a class hierarchy, so it is preferable to use an ECS for this reason
alone. Depending on the implementation, another benefit could be increased speed. Using a data-oriented approach,
iterating over components is extremely fast since the data is stored sequentially, minimizing cache misses. Separating
data into different components allows even faster iterations as you can pack more data into a cache line. This is
preferable as usually most code won't care about all the data an entity has. For example a renderer might want rendering
data, but won't care about data relating to physics.

The cost of this approach is that random access tends to be slower. If you would like to get all the components that an
entity has, that's a potential cache miss for each component that needs to be fetched. Note that this is mostly a nonissue
as long as random access is not used heavily.

One way to implement an ECS is through the use of "archetypes", this is used in Unity's DOTS. An example implementation
can be found in [flecs](https://github.com/SanderMertens/flecs). In this implementation, components are intelligently
sorted based on usage patterns to speed up iterations. In some cases this can improve performance, in others, the cost
of sorting outweighs the speedup. In my opinion, this is a fine tradeoff, and greatly improves ease of use from a user
perspective. The ECS in my engine does not use archetypes because of one reason: it's too complicated to implement.

In the past, I've used a library called [Entt](https://github.com/skypjack/entt) for my ECS needs. For my engine I
wanted to write everything from scratch, so I looked to Entt for "inspiration." Entt relies heavily upon templates,
which made reading the codebase rather difficult. Luckily the maintainer also has a [blog](https://skypjack.github.io/)
where he discusses entity component systems. Entt uses a sparse table to store entities. The implementation is quite
clever in my opinion and more importantly: dead simple.

A sparse table consists of two arrays: a sparse array and a dense array. The dense array is used for iterating over the
components. The trick is as follows: the sparse array stores the position of the entity in the dense array, and the
dense array stores its position in the sparse array. This allows for efficient random access (2 cache misses at least,
not a big deal) and efficient iteration.

![dense-sparse mapping](/assets/images/sparsemapping.png)

Deletion and insertion is trivial too:

![insertion](/assets/images/sparseadd.png)
![deletion](/assets/images/sparsedelete.png)

A trick we can do with sparse tables to make iterating over multiple components faster is to maintain a subarray within
the dense array. This makes insertion and deletion a bit more complicated, I'll leave the implementation up to the
reader's imagination. The problem with this approach is that it doesn't work if we want to iterate over two sets of
components with an intersection. This is a limitation users have to keep in mind and makes using the ECS slightly more
difficult. This is an aspect where an ECS that uses archetypes has an advantage.

In the case where we want to iterate over two sets of components with an intersection, we can sort one set of components
using the subarray strategy. For the other set, we sort the set of components that aren't in the first set (the
complement) using the subarray strategy. For the set of components in the intersection, we have to access them through
random access. This can be done by indexing the sparse array to find the index of the component in the dense array.

My implementation of an ECS can be found [here](https://github.com/DanDanCool/JollyEngine/tree/main/Engine/Source/Scene), in Scene.h and Scene.cpp
