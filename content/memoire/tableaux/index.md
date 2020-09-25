+++
title = "Les tableaux"
weight = 3
description = "Pour stocker une suite de variables du même type en C on peut utiliser les tableaux."

[extra]
illus = "illus.webp"
+++

C'est souvent très utile de pouvoir stocker un grand nombre de
données du même type sans avoir à faire ce genre de chose :

```c
int x_1 = 10;
int x_2 = 15;
int x_3 = 51;
// etc.
int x_589 = 2;
```

Surtout que c'est très difficile d'automatiser des opérations sur ce genre
de liste de variables, à moins de copier 589 l'opération en question.

Heureusement, on a inventé quelque chose de fantastique pour ça : les tableaux.
L'idée est de mettre les uns à la suite des autres dans la mémoire toutes nos variables,
mais de ne retenir l'adresse que de la première.

On a ensuite un mécanisme pour accéder à un élément à un *indice* donné.
Bref, c'est comme les listes en Python ou en OCaml.

La différence est que la taille d'un tableau doit être connue au moment de la compilation
en C. Sans ça, le compilateur ne saurait pas déterminer de combien le pointeur de pile
devrait être décalé quand on crée notre tableau.

Le type d'un tableau est `type nom[taille]`, avec `type` le type des éléments du tableau
(on ne peut pas mélanger comme dans les listes Python, il n'y a qu'un type possible pour
les valeurs du tableau), `nom` le nom de la variable, et `taille` la taille du tableau.

On peut l'initialiser en mettant ses valeurs entre accolades, avec des virgules entre.

```c
// un tableau de 20 int, pas initialisé
int tableau_non_initialise[20];

// un tableau de 3 float, avec des valeurs par défaut
float reels = { 0.0, 1.5, 3.14 };
```

On peut accéder à un élément d'un tableau avec la syntaxe `nom_du_tableau[indice]`, avec
`indice` le numéro de l'élément dans le tableau (en partant de 0) :

```c
float pi_enfin_a_peu_pres = reels[2];
```

On peut aussi écrire dans les tableaux avec cette syntaxe :

```c
for (int i = 0; i < 20; i++) {
    tableau_non_initialise[i] = i * 2;
}
```

## À quoi ça ressemble sur la pile

Quand on crée un tableau sur la pile, les valeurs sont juste écrites
les unes à la suite des autres. Par exemple, ce tableau :

```c
char chiffres[3] = { 1, 7, 12 };
```

Sera représenté de cette façon sur la pile :

```
00001010  ← Élément n°3 : 12
00000111  ← Élément n°2 : 7
00000001  ← Élément n°1 : 1
```

## Les chaînes de caractères

Le type `str` ou `string` n'existe pas en C. On doit se contenter de
tableaux de caractères ASCII (c'est-à-dire des `char`). Heureusement,
il y a une syntaxe un peu plus sympathique que celle avec les accolades
pour initialiser des chaînes, avec des guillemets :

```c
char ville[20] = "Grenoble";
```

Cet exemple va vous poser des soucis si vous habitez à Saint Martin d'Hères.
Déjà parce que ça fait 21 caractères et qu'on ne peut en avoir que 20,
mais aussi parce qu'il y a des accents et qu'ils sont très mals gérés
par l'ASCII (la plupart des langages de programmation modernes utilisent
de l'UTF-8 à la place, qui permet d'avoir des accents, des alphabets autre
que l'alphabet latin, des émojis, et tout un tas d'autres trucs super
pratiques). Bref les chaînes de caractères en C ne sont pas parfaites,
mais elles suffiront largement dans la plupart des cas.

On peut aussi se demander se qui arrive à toute la partie du tableau où on a
rien écrit : « Grenoble » fait moins de 20 caractères, mais cette place est
quand même réservée !

La réponse est que juste après la fin du texte, un caractère spécial, le
`\0` (de code ASCII 0), qui signifie dans les chaînes de caractères
« c'est la fin ». Le reste de la place pourra servir si jamais
on décide d'écrire plus de texte plus tard, mais pour le moment c'est juste
de la mémoire non initialisée.

On peut donc facilement déplacer la fin d'une chaîne :

```c
ville[3] = '\0'; // On change l'emplacement de la fin, tout ce qui est après ne compte plus
ville[3] = 0; // Cette ligne fait exactement la même chose, mais utilise le code ASCII de '\0' directement
printf("%s\n", ville); // Affiche juste « Gre »
```

## Pointeurs et tableaux

On peut utiliser la syntaxe des crochets pour accéder à un indice
avec les pointeurs aussi. Ainsi, un pointeur vers un type
donné peut très bien désigner un tableau avec des éléments de ce type.

On peut créer un pointeur vers un début de tableau pour le passer à une
autre fonction sans avoir à le copier en entier.

```c
char ville[20] = "Grenoble";
char *ville_pointeur = &ville; // Cette ligne donne un warning parce qu'on perd l'information de la taille du tableau dans le type
ville_pointeur[2] = 'a';
printf("%s\n", ville); // Affiche « Granoble »
```

Le type `char *` est très utilisé pour désigner une chaîne de caractères.
Et donc `char **` sert pour les listes de chaînes de caractère (une liste de listes de caractères).
