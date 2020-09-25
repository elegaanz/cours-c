+++
title = "Les allocations dynamiques"
weight = 4
description = "Il est parfois utile de pouvoir allouer de la mémoire au moment de l'exécution du programme. C'est ce que permet la fonctionc malloc."

[extra]
illus = "illus.webp"
+++

Un souci que vous avez peut-être remarqué avec le fonctionnement de la pile
est qu'on doit savoir quelle taille fait une variable pour pouvoir déplacer
le pointeur de pile au bon endroit quand on dépile et quand on empile des
valeurs. Pas de souci dans la plupart des cas, un `short` prend 16 bits,
un `char` en prend 8, un tableau de 10 `long` prendra 10×64 = 640 bits etc.

Mais imaginons que vous demandiez d'entrer un nombre indéterminé de nombres
pour en faire leur somme. Vous allez vouloir les stocker dans un tableau.
Une solution est de pré-allouer un tableau de taille fixe, disons 1000 éléments.
Mais si quelqu'un s'amuse à rentrer 1001 éléments vous aurez un bug dans
votre programme : dans le « meilleur » des cas, il plantera immédiatement
parce que vous écrivez à un endroit interdit de la mémoire, dans le pire cas
vous écrirez n'importe quoi à un endroit de la mémoire que vous ne deviez pas
toucher et des bugs plus importants en découlent (je ne vais pas faire un
cours de sécurité informatique ici, mais ce genre de bug a déjà causé au moins
[11 075 failles de sécurité](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=buffer+overflow)
dans des logiciels connus et développés par des professionels).
En plus de ça, si on ne rentre que deux nombres avant de demander au programme
de faire leur somme, 998 emplacements dans le tableau auront pris de
la place en mémoire pour rien.

Bref, une bien meilleure solution serait de demander combien de
nombres vont être entrés dès le début, de créer un tableau de cette
taille, et de lire juste le bon nombre d'entiers.

Le souci c'est qu'on ne peut pas donner autre chose qu'une constante
quand on déclare la taille d'un tableau. Si on essaie de faire ça par exemple
ça ne fonctionnera pas :

```c
int taille;
scanf("%d", &taille);
int tableau[taille]; // erreur : taille n'est pas une constante
```

Il faut qu'on puisse réserver une place dans la mémoire
au moment de l'exécution du programme et pas au moment de la compilation.

Pour ça, on va découvrir quelque chose de merveilleux : **le tas**.

C'est une zone de mémoire différente de la pile, mais où on peut aussi mettre
des variables. La différence du tas est qu'il n'est pas « linéaire » comme la pile,
c'est plus une sorte de gros bazar où on met nos données là où on a de la place.
Pensez à un tas d'habits sales, désordonné. Comme on peut mettre nos données un peu là
où on veut dans le tas tant qu'il y a de la place, on peut demander à tout moment de
chercher et de réserver un emplacement d'une taille arbitraire.

Pour réserver de l'espace sur le tas, on utilise la fonction `malloc` (« _**m**emory **alloc**_ », allocation de mémoire).
Elle prend en paramètre le nombre d'octets dont on aura besoin sur le tas,
et renvoie un pointeur vers l'emplacement du tas où on pourra écrire
nos données. Cette fonction viens de `stdlib.h`, il ne faudra donc pas
oublier de l'inclure.

Par exemple, on peut réserver 4 octets, et écrire `"yo"` dedans :

```c
#include <stdlib.h>

// puis dans le main :

char *texte_sur_le_tas = malloc(4);
texte_sur_le_tas[0] = 'y';
texte_sur_le_tas[1] = 'o';
texte_sur_le_tas[2] = '\0'; // fin de chaîne
// il reste un bit dans la mémoire qu'on a alloué, mais on ne s'en sert pas
```

L'espace dont on dispose dans notre tas est quand même limité, et il faut donc indiquer
quand on a plus besoin d'une zone qu'on s'était alloué. On utilise pour ça la fonction `free`
qui prend juste le pointeur à « libérer ». Une fois libéré, on pourra potentiellement
réutiliser cette zone du tas pour un prochain `malloc`.

L'avantage de cette technique est qu'on peut redimensionner notre zone de mémoire si on se rend
compte qu'elle est trop petite :

- on fait une nouvelle allocation plus grande ;
- on copie les données de l'allocation trop petite dans la nouvelle ;
- on libère l'allocation trop petite.

On a même une fonction `realloc` pour faire ça pour nous : elle prend le pointeur
vers la zone trop petite, et la taille de la nouvelle zone, et fait tout le travail !

Pour éviter de devoir calculer la taille dont on a besoin à la main, on peut utiliser
la fonction `sizeof` qui prend un nom de type ou une variable en paramètre et donne
la taille nécessaire pour stocker quelque chose de ce type, en octets. Par exemple `sizeof(char)`
renvoie 1, car il suffit d'un octet pour stocker un `char`.

On peut l'utiliser pour allouer un tableau de 10 `int` :

```c
int *tableau = malloc(10 * sizeof(int));
```

## Pourquoi ne pas tout mettre sur le tas ?

Le problème du tas c'est qu'il faut trouver un endroit où on a assez de place
dès qu'on fait une nouvelle allocation. Cette recherche peut mettre relativement
longtemps, comparé au temps qu'il faut pour déplacer le pointeur de pile.

En plus de ça, si on oublie de faire un `free`, notre programme va garder de la mémoire
pour rien, ce qui fait qu'on a de moins bonnes performances (notamment parce que c'est
plus dur de trouver de la place sur le tas quand on fait un `malloc`).

Mais si on fait deux fois un `free` sur un même pointeur, ou si on essaie d'utiliser
un pointeur qui a déjà été `free` on aura aussi un programme qui plante !

Bref, bien gérer le tas est assez complexe. C'est pour ça que la plupart des
langages « haut niveau » gèrent la mémoire pour nous (même si ça diminue les performances
par rapport à une gestion manuelle).
