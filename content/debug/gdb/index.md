+++
title = "Utiliser GDB"
weight = 1
description = "GDB est un débogueur, un outil très utile pour trouver et corriger des bugs."

[extra]
illus = "illus.webp"
+++

GDB (**G**NU **d**e**b**buger) est une commande très utile pour analyser
les bugs dans ses programmes C.

Si vous avez un bug et que vous voulez vous servir de GDB pour l'éliminer,
la première étape est de rejouter l'option `-g` à votre commande de compilation
Clang (ce qui peut être fait avec la variable `CFLAGS` si vous utilisez un Makefile).
`clang truc.c -o truc` devient donc `clang -g truc.c -o truc` (l'ordre n'a pas d'importance,
on peut rajouter le `-g` à la fin aussi).

Cette option compile votre programme en mode « débogage » (mais ce mot est vraiment
moche alors je vais juste dire *debug* ou *debugging* à partir de maintenant, même
si l'Académie française désapprouverait). Ça veut dire que Clang va rajouter plein
d'information au fichier binaire qu'il génère, que GDB pourra utiliser pour
re-traduire le binaire en C, et ainsi afficher le vrai nom de nos fonctions et notre
code en C quand on debug, à la place de binaire illisible.

Ensuite, lancez GDB avec comme argument le nom du programme à debugger. Par exemple, si
on a un fichier exécutable `truc`, on lance GDB avec `gdb truc`. Un long message
s'affiche, et on se retrouve dans quelque chose qui ressemble un peu à Bash : on peut
taper des commandes, les exécuter avec Entrée, et leur résultat s'affiche. La différence
c'est que les commandes qu'on va pouvoir taper ici vont nous servir à debugger notre programme.

La première commande à connaître est sans doute `run`, qui lance notre programme.
Une autre commande très utile est `quit` pour fermer GDB, et retourner dans Bash (si on
vous demande si vous voulez vraiment quitter, entrez `y` (« *yes* ») et validez).

## Comment vraiment débugger

L'idée du débuggage est de s'arrêter à un endroit du programme et de pouvoir
lire la valeur de différentes variables, pour mieux comprendre ce qui se passe
aux différents moments de notre programme.

Pour s'arrêter, il y deux choix :

- soit on a une erreur de segmentation, et on veut s'arrêter au moment où on la rencontre,
  il n'y a alors rien à faire de plus que `run`, GDB se mettra en pause au moment où
  le programme rencontrera l'erreur ;
- soit on veut définir nous même un endroit où on veut s'arrêter.

Dans ce cas, il faudra utiliser la commande `break FICHIER:LIGNE` (de préférence avant `run`).
`FICHIER` est le nom du fichier `.c` qui contient le code que vous voulez
débugger, et `LIGNE` est le numéro de ligne où vous voulez vous arrêter.

On va prendre ce fichier `boucle.c` comme fichier d'exemple :

```c
#include <stdio.h>

void afficher_nombre(int nombre) {
    printf("%d\n", nombre);
}

int main() {
    printf("Je vais compter jusqu'à 100 !\n");
    for (int i = 1; i <= 100; i++) {
        afficher_nombre(i);
    }

    return 0;
}
```

Ce code fait bien ce qu'on veut, il n'y a pas de bug, mais je vais
m'en servir pour montrer comment on peut utiliser GDB.

On peut mettre le programme en pause dès qu'on affiche un nombre avec
avec `break boucle.c:4`.

Une fois qu'on est en pause, il y a différentes choses qui vont pouvoir nous aider
à comprendre ce qui se passe. Déjà, GDB affiche ce genre de message :

```
Breakpoint 1, afficher_nombre (nombre=1) at boucle.c:4
4	    printf("%d\n", nombre);
```

Sur la première ligne, on voit l'endroit où on s'est arrêtés :

- `Breakpoint 1` parce que c'est le premier « *breakpoint* » qu'on a défini, c'est-à-dire
  le premier point d'arrêt défini avec `break` ;
- `afficher_nombre` est le nom de la fonction dans laquelle on est ;
- `(nombre=1)` est l'argument de la fonction ;
- `at boucle.c:4` est l'emplacement où on s'est arrêtés ;

Sur la deuxième ligne, on voit le numéro de ligne à gauche, et le contenu
de la ligne où on s'est arrêtés. Ces informations donnent déjà beaucoup d'aide
dans le cas d'une erreur de segmentation : on peut savoir exactement quelle ligne
pose problème, et essayer de réfléchir à ce qui ne va pas à partir de là.

Mais on peut obtenir plus d'information que ça !

Avec `bt` on peut inspecter la « _**b**ack**t**race_ », c'est à dire la liste des fonctions
qui ont amené celle-ci à être appelée. Dans notre exemple, on voit :

```
#0  afficher_nombre (nombre=1) at boucle.c:4
#1  0x000000000040056c in main () at boucle.c:10
```

Chaque ligne corrspond à une fonction, la numéro 0, en haut est celle où on
est actuellement. Celle en dessous est celle qui l'a appelée (le `0x000000000040056c`
peut être ignoré dans la plupart des cas, c'est le numéro de l'instruction qui
a appelé `afficher_nombre`). Ici, on a que deux fonctions, mais on pourrait en avoir
bien plus en dessous, si `main` avait été appelée par d'autres fonctions avant.

Par défaut, on est dans le contexte de la fonction `#0`, mais on peut se « déplacer »
dans un autre contexte avec la commande `frame NUMERO`. GDB montre alors l'endroit
où cette fonction était arrếtée (en général, c'est là où on appelait la fonction au dessus dans la liste).

Pour voir les valeurs des variables locales d'une fonction, on peut utiliser
`info locals`. Il y a aussi `info args` pour afficher les valeurs des arguments
de la fonction. Voici un exemple de commandes qui affichent les variables de
`afficher_nombre` puis de `main` au moment où on est en pause :

```
(gdb) info args                                   # On affiche les arguments de afficher_nombre, il n'y a pas de variables locales
nombre = 1
(gdb) frame 1                                     # On se déplace dans le contexte de « main »
#1  0x000000000040056c in main () at boucle.c:10
10	        afficher_nombre(i);
(gdb) info locals                                 # On affiche les variables locales de main
i = 1
```

On peut aussi exécuter une instruction en C et afficher son résulat avec `print EXPRESSION`.
Par exemple, si on est toujours arrêtés dans la fonction `main`, on peut faire :

```
print i + 2
$1 = 3
```

Le `$1` est le résulat de notre calcul (`i + 2` = `1 + 2` = `3`).

On peut aussi demander à GDB d'appeler une fonction dès qu'on sort de la pause
avec `call EXPRESSION`.

Enfin, une fois qu'on a vu ce qu'on voulait voir, on peut reprendre l'exécution
avec `continue` ou la version abbrégée `c`. Le programme va tourner jusqu'à re-tomber
sur un point d'arrêt.

Il existe d'autres commandes utiles dans GDB, vous pouvez les explorer avec `help`
si vous êtes curieux⋅se.
