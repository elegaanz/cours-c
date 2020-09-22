+++
title = "Compiler à la main"
description = "Ce chaptire explique comment utiliser Clang pour compiler un programme en C."
weight = 2

[extra]
illus = "illus.webp"
+++

On va maintenant voir comment compiler du C. Je vous propose d'utiliser
ce code, qu'on va enregistrer dans un fichier `hello.c` :

```c
#include <stdio.h>

void main() {
    printf("Hello, world!");
}
```

Pour transformer ce code en binaire, on va avoir besoin d'un autre
programme appelé compilateur. Il en existe plusieurs pour le langage C,
comme GCC ou MSVC, mais nous allons utiliser [Clang](https://clang.llvm.org/)
(qui se lit « Si langue », pour « *C language* », même si dire « klangue » c'est marrant).
Je vais considérer que vous avez réussi à l'installer sur votre ordinateur.
Je vais aussi considérer que vous savez ouvrir un terminal et vous déplacer
(avec la commande `cd` par exemple) jusqu'au dossier où se trouve votre code.

Pour compiler un programme C avec Clang, il suffit de faire :

```bash
clang hello.c
```

Clang va alors créer un nouveau fichier, `a.out`, où il va écrire le code
binaire correspondant au C qu'on avait écrit. On peut l'exécuter en tapant :

```bash
./a.out
```

Ce qui devrait afficher « Hello, world! ».

On peut bien sûr donner plusieurs noms de fichier à `clang` si notre code est divisé
en plusieurs fichiers, et il accepte tout un tas d'options pour gérer comment notre code
est compilé, mais nous n'en avons pas vraiment besoin pour le moment. La seule qui est utile
à mon avis est `-o` qui permet de donner un nom autre que `a.out` au fichier de sortie.

Par exemple, on peut enregistrer notre programme dans le fichier `hello` (sous Linux, et UNIX en
général, les exécutables n'ont pas d'extension) :

```bash
clang hello.c -o hello
# Puis ensuite
./hello
```
