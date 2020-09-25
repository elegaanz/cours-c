+++
title = "Choses à vérifier en cas d'erreur de segmentation"
weight = 2
description = "Les erreurs de segmentation sont très courantes en C, mais leurs causes sont souvent les mêmes."

[extra]
illus = "illus.webp"
+++

Les erreurs de segmentations sont sans doute un des bugs les plus courants
quand on code en C. Cette erreur veut globalement dire qu'on essaie
de lire ou d'écrire à un endroit de la mémoire qu'on a pas le droit d'accéder.

Pour localiser précisément l'instruction qui fait une erreur de segmentation,
je vous conseille d'utiliser [GDB](/debug/gdb).

Une fois que vous avez localisé la ligne qui cause l'erreur de segmentation,
vérifiez que :

- vous ne lisez pas [un pointeur nul](/memoire/pointeurs) ;
- vous ne lisez ou n'écrivez pas en dehors des limites d'un tableau ou d'une chaîne, qu'elle
  soit allouée sur la pile ou sur le tas ;
- vous n'êtes pas en train d'écrire dans une chaîne de caractères « constante » ;

Une chaîne de caractères constante est une variable de type `char *` initialisée
avec une chaîne entre guillemets, comme par exemple :

```c
char *nom = "Alice";
```

Quand on fait ça, le compilateur ne va pas allouer d'espace sur la pile pour stocker
cette chaîne, mais la mettre dans une autre partie de la mémoire, la mémoire statique (on en n'a pas
parlé dans le chapitre sur la mémoire car elle est moins importante que la pile et le tas).
Les variables dans la mémoire statique peuvent être en mode « lecture seule »,
ce qui permet de créer des pointeurs vers ces valeurs, mais pas de les modifier.
C'est exactement ce qui se passe ici : cette façon d'initialiser les chaînes les
met en « lecture seule ».

Pour régler ce souci on peut soit remplacer ce pointeur par un tableau a taille bien définie
(qui sera stocké sur la pile), soit utiliser un `malloc` pour obtenir un pointeur qu'on peut lire
et écrire.

```c
// Solution 1 :
char nom[5] = "Alice";

// Solution 2 :
char *nom = malloc(5 * sizeof(char));
strcpy(nom, "Alice"); // strcpy copie une chaîne vers une autre
```

La première solution est plus simple à mettre en place, la seconde permet
de redimensionner la chaîne à un moment donné si on a besoin de plus
de caractères.
