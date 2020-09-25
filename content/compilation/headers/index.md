+++
title = "Travailler avec plusieurs fichiers"
description = "Ce chapitre explique comment séparer son code C en plusieurs fichiers pour mieux organiser ses projets."
weight = 4

[extra]
illus = "illus.webp"
+++

Il est souvent utile de diviser son code en plusieurs fichiers,
pour bien séparer les différentes parties de son programme.

Le souci avec le C est qu'il y a plusieurs règles pour qu'une fonction,
un type ou une constante soit utilisable :

- il faut que la définition soit dans le même fichier que l'utilisation ;
- il faut que la définition soit avant l'utilisation dans le fichier ;
- il faut que chaque définition n'apparaisse qu'une seule fois ;

Ces contraintes donnent l'impression que c'est très compliqué voir impossible
d'avoir plusieurs fichiers en C. Mais heureusement, il y a des solutions pour chacun
des problèmes ci-dessus !

## Inclure d'autres fichiers

Les compilateurs C sont capables de « transformer » notre code avant la
compilation avec ce qu'on appelle un *préprocesseur*. Les instructions
pour le préprocesseur commencent par un `#`. Celle qui va nous intéresser ici
est `include fichier` où `fichier` est un nom de fichier.

Cette instruction est remplacée par le contenu du fichier en question.
Ça permet donc de définir une fonction dans un fichier et de l'inclure
dans un autre qui pourra l'utiliser !

Ainsi, ce code fonctionne :

```c
// Dans main.c
#include "addition.c"

int main() {
    int x = addition(10, 5);
    printf("x = %d\n", x);

    return 0;
}
```

```c
// Dans addition.c
int addition(int a, int b) {
    return a + b;
}
```

Si on compile avec `clang main.c`, Clang va voir qu'il faut inclure `addition.c`
dans `main.c` et transformer `main.c` en :

```c
int addition(int a, int b) {
    return a + b;
}

int main() {
    int x = addition(10, 5);
    printf("x = %d\n", x);

    return 0;
}
```

Notez que le nom de fichier à inclure doit être entre guillemets si il
est dans le même dossier que le fichier actuel, et entre chevrons (`<` et `>`)
si c'est un fichier « global », un module fourni par le système d'exploitation
ou par un autre projet.

Mais ça ne règle pas tous nos soucis, imaginons qu'on ai trois fichiers `un.c`,
`deux.c` et `trois.c` et que :

- `un.c` inclus `deux.c` et `trois.c` ;
- `deux.c` inclus `trois.c` ;

Les fonctions de `trois.c` seraient définies deux fois dans `un.c` au final,
et le compilateur nous râlerait dessus. Pour éviter ça, on va utiliser deux autres
instructions de préprocesseur : `ifndef` et `define`.

`define` définit une constante de préprocesseur, une sorte de variable qui n'existe
que pendant la compilation et qu'on ne peut pas utiliser pour notre programme.
`ifndef` regarde si une constante donnée est définie. L'idée est donc de faire quelque chose comme :

```c
// dans trois.c
#ifndef TROIS
#define TROIS 

// ici on met le code qu'il y avait déjà dans le fichier

#endif // Un ifndef fini par un endif
```

Tout ce qui se retrouve entre le `ifndef` et le `endif` sera ignoré
si jamais `TROIS` est déjà défini. Sinon, ce code sera bien inclus, 
et on défini `TROIS` avec `define TROIS`. On est sûrs que même si on
inclus plusieurs fois `trois.c`, son code ne sera copié que la première fois !

## Les fichiers d'entête

Une pratique assez courante est d'avoir deux fichiers par « module » de notre
programme :

- un fichier qui contient juste des définitions ;
- un fichier qui contient le vrai code ;

Le fichier de définition est un fichier `.h` (_**h**eader_, « entête »).
Il contient les `ifndef` et `define` du module, ainsi que les *prototypes*
des fonctions du module, c'est-à-dire les fonctions sans leur code, juste avec
un `;` après les arguments. On y met souvent les définitions de
types s'il y en a en plus. Voici par exemple le fichier `addition.h`
correspondant au fichier `addition.c` de toute à l'heure :

```c
#ifndef ADDITION
#define ADDITION

int addition(int a, int b);

#endif
```

Ensuite, on fait un `include` du fichier `.h` dans le `.c` correspondant,
et on fait de même dans tous les autres fichiers `.c` ou `.h` qui ont aussi
besoin de ce module.

L'avantage de cette technique est qu'on peut très facilement savoir
ce que contient un module juste en lisant son `.h`, bien plus compact
qu'un `.c` (qui contient tout le code et pas juste les définitions).

Notez aussi que définir une fonction sans son code, puis la redéfinir
avec son code ne compte pas comme une redéfinition, donc le compilateur
n'a pas de souci avec cette technique.

Il faudra par contre préciser tous les fichiers `.c` à Clang avec cette technique,
car on ne les inclus plus (vu qu'on n'inclus plus que des `.h`). En général, `clang *.c`
marche bien pour ça.
