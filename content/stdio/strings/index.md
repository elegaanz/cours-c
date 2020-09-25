+++
title = "Lire et écrire dans des chaînes"
weight = 3
description = "Ce chapitre explique comment lire et écrire dans des chaînes de caractères."

[extra]
illus = "illus.webp"
+++

Il existe aussi des fonctions pour faire des `printf` et des `scanf`
dans des chaînes de caractères quelconques. On leur rajoute juste
le préfixe `s` pour **s**tring. Elle prennent un `char *` comme
premier argument, c'est à dire un pointeur vers le premier caractère
d'une chaîne, la chaîne dans laquelle lire ou écrire.
Les arguments suivants sont les mêmes que pour des
`printf` et `scanf` normaux. Cette fonction viens aussi de `stdio.h`
qu'il faudra donc inclure.

Voici un exemple simple pour `sprintf` :

```c
#include <stdio.h>

int main() {
    char recette[10] = "Couscous";
    char ingredient[10] = "chocolat";
    char fusion[25] = "";
    sprintf(fusion, "%s au %s", recette, ingredient);

    // fusion vaut maintenant "Coucous au chocolat"

    return 0;
}
```


Et pour `sscanf` :

```c
#include <stdio.h>

int main() {
    int jour = 0;
    int mois = 0;
    char anniv[25] = "Anniversaire le 12/11";
    sscanf(anniv, "Anniversaire le %d/%d" &jour, &mois);

    // jour vaut 12 et mois vaut 11

    return 0;
}
```
