+++
title = "Automatiser avec make"
description = "Découvrez comment écrire des Makefiles simples pour gagner du temps quand vous travailler sur des projets en C."
weight = 3

[extra]
illus = "illus.webp"
+++

Taper toujours la même commande pour compiler son programme peut vite devenir
agaçant, surtout quand celle-ci utilise tout un tas d'arguments différents.
Et c'est encore pire quand on doit compiler plusieurs programmes et qu'on a
donc différentes commandes de compilation à retenir.

Pour résoudre ce problème, on peut utiliser la commande `make`. C'est un
programme qui peut lancer de petits scripts pour nous. Ces scripts sont
définis dans un fichier appelé `Makefile`.

On met ce fichier avec notre code, et quand on tape la commande `make`
il sera exécuté.

Un Makefile est composé de plusieurs règles, chacune ayant un nom,
qui correspond généralement à un nom de fichier. Cette règle a aussi
une liste de commande qui expliquent comment générer ce fichier.
Si on reprend l'exemple de tout à l'heure on pourra mettre une
règle qui s'appelle « hello » avec la commande `clang hello.c -o hello`.

La syntaxe pour écrire une règle dans un Makefile est :

```make
nom-de-la-regle:
    commande 1
    commande 2
    # etc.
    commande n
```

Attention de bien mettre des tabulations et pas des espaces pour indenter,
Make ne comprendra pas votre fichier sinon.

On peut écrire plusieurs règles à la suite. La première sera celle
par défaut, mais on peut choisir d'exécuter une règle spécifique avec
la commande `make nom-de-la-regle`.

Par défaut make affiche les commandes avant de les exécuter, mais on peut
mettre un `@` devant le nom de la commande pour juste afficher sa sortie.

## Dépendances entre règles

Une règle peut aussi avoir besoin d'une autre règle
avant de pouvoir s'exécuter. On peut préciser le noms
des règles dont on a besoin juste après les deux points qui suivent
le nom de la règle. Par exemple, si on prend ce Makefile :

```make
un:
    @echo "Règle un !"

deux: un
    @echo "Règle deux !"

trois: deux
    @echo "Règle trois !"
```

Et qu'on exécute `make trois`, Make va voir que `trois` a besoin de `deux`
d'abord, et que deux a besoin de `un`. Il va donc exécuter `un`, puis `deux`,
puis `trois`, et on verra :

```
Règle un !
Règle deux !
Règle trois !
```

## Variables

On peut aussi définir des variables pour rendre nos scripts plus lisibles, et
plus simples à comprendre. La syntaxe est `NOM=valeur`, et par convention le nom
est toujours en majuscules. Pour les utiliser ensuite, on fera `$(NOM)`.

Par exemple on peut définir une liste de fichiers à compiler, et faire une règle
pour les compiler, et une règle pour en faire un fichier `.zip` à envoyer à un prof
ou à un ami avec qui on travaille sur le code :

```make
FICHIERS=truc.c machin.c chiploufance.c

compiler:
    clang $(FICHIERS) -o mon-programme

archiver:
    zip code.zip $(FICHIERS)
```

## Règles implicites

Comme beaucoup de Makefile ont tendance à avoir des règles pour compiler du C
ou d'autres langages « classiques », Make supporte ce qu'on appelle des règles
implicites. Ainsi, si il voit une règle pour générer un fichier `.o` (qui est un fichier
binaire « partiel », et qu'on va devoir grouper avec d'autres `.o` pour avoir un exécutable
complet), il sait qu'il peut chercher un fichier du même nom mais avec l'extension `.c` pour le générer.
De même, si il voit une règle sans extension spécifique mais qui dépend seuleument de
fichiers `.o`, il sait qu'il doit les grouper ensemble pour générer un exécutable.

On peut par exemple écrire ce Makefile :

```make
mon-programme: mon-programme.o
```

Si on tape `make`, Make va prendre la règle par défaut (la première : `mon-programme`), voir qu'il
faut d'abord générer le fichier `mon-programme.o` puisqu'il est dans les dépendances, et pour le générer
il sait qu'il peut compiler `mon-programme.c`. Il va donc lancer le compilateur, et transformer l'unique
fichier `.o` en exécutable.

Par défaut Make n'utilise pas Clang pour compiler mais GCC. On peut changer la variable `CC` (**C** **C**ompiler)
pour qu'il utilise Clang. On peut aussi utiliser la variable `CFLAGS` pour donner d'autres options que
les noms de fichiers à Clang. Par exemple, si on veut activer tous les avertissements avec `-Wall` :

```make
CC=clang
CFLAGS=-Wall

mon-programme: mon-programme.o
```

Voilà, c'est l'essentiel à savoir sur les Makefiles. Il y a plein d'autres choses, mais elles
ne nous serviront pas.
