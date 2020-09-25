+++
title = "Exercices"
weight = 5
description = "Une série d'exercices pour s'entraîner sur les concepts liés à la mémoire en C."
+++

## 1 - Comprendre la pile

Pouvez-vous deviner ce que ce programme affiche ? Pourquoi ?

```c
#include <stdio.h>

void a() {
    int x = 19;
}

void b() {
    int y;
    printf("y vaut %d\n", y);
}

int main() {
    a();
    b();

    return 0;
}
```

Si vous n'arrivez pas à répondre, n'hésitez pas à le compiler
et à le lancer pour avoir une idée de ce qui se passe. Faites
un schéma de la pile au cours du programme, et rappelez-vous que
les processeurs évitent un maximum d'opérations inutiles.

## 2 - Jouer avec les pointeurs

Écrivez un programme qui crée une variable `x` avec une valeur quelconque (utilisez
un type simple comme `int` ou `char` pour éviter  de complexifier l'exercice), avec
la valeur que vous voulez. Affichez l'adresse mémoire de cette variable (avec un pointeur, `printf` et un peu d'astuce).

Ensuite, demandez un nombre au clavier et interprétez-le comme une adresse dans la mémoire (pendant
vos tests ré-rentrez l'adresse affichée juste avant). Créez un pointeur vers cette adresse,
modifier la valeur à cette adresse, et affichez `x`.

Normalement `x` devrait avoir changé, et vous ne devriez pas avoir d'erreur de segmentation.

Si vous avez des soucis, assurez vous de stocker les nombres qui correspondent à des adresses
mémoire sur des `int` si vous avez une machine 32 bits, et sur des `long` si vous avez une machine
64 bits (ce qui est le plus probable, mais si vous ne savez pas, essayez les deux).

Je précise que faire ce genre de choses sert seulement à comprendre le fonctionnement des pointeurs,
il ne faut jamais faire ça dans la vraie vie (laisser l'utilisateurice écrire des données là où iel
a envie dans la mémoire du programme peut être très dangeureux).

<details>
    <summary>Proposition de correction</summary>

Mon ordinateur est en 64 bits, mais si vous avez du 32 bits, remplacez
les `long` par des `int` et les `%lx` par des `%x`.
    
```c
#include <stdio.h>

int main() {
    // On crée la variable x
    int x = 19;
    // On crée un pointeur vers x
    int *pointeur_sur_x = &x;

    // On affiche l'adresse en héxadécimal avec %x.
    // L'astuce est que le pointeur est juste un nombre
    // qui est l'adresse en mémoire de x.
    // Si on l'affiche avec %lx, sans le déréférencer, on vera cette adresse.
    printf("Adresse de x = %lx\n", pointeur_sur_x);

    // On va maintenant lire une adresse entrée au clavier
    long adresse = 0;
    scanf("%lx", &adresse);
    int *nouveau_pointeur = adresse;

    // On modifie la mémoire à l'adresse lue
    *nouveau_pointeur = 38;

    // On affiche x
    printf("x vaut maintenant %d\n", x);

    return 0;
}
```

</details>

