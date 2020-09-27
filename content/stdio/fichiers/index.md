+++
title = "Lire et écrire des fichiers"
description = "Les fichiers permettent de conserver des données sur le disque dur, et donc de les sauvegarder même après la fin d'un programme. Ce chapitre explique comment les lire et les écrire en C."
weight = 2

[extra]
illus = "illus.webp"
+++

Je vais considérer que vous savez ce que c'est qu'un fichier, un chemin, etc. et je vais juste expliquer
comment les manipuler en C.

Pour information, la plupart des fonctions qu'on va voir commencent par un `f` pour **f**ile (« *fichier* »), leur « vrai »
nom est en général ce qui suit.

Pour commencer, il faut « ouvrir » le fichier, avec la fonction `fopen` (qui vient de `stdio.h`).
Cette fonction prend le chemin du fichier à ouvrir (relativement au dossier dans lequel on lance notre programme,
ou de manière absolue si on le commence avec un `/`), et le mode d'ouverture (on va en reparler juste après).
Elle retourne un `FILE *`, un pointeur vers un fichier, qu'on va pouvoir lire ou écrire.

Le mode est une chaîne de caractère indiquant comment ouvrir le fichier :

- s'il y a un `r`, il sera ouvert en mode *read* (on pourra le lire) ;
- s'il y a un `w`, il sera ouvert en mode *write* (on pourra écrire dedans) ;
- s'il y a un `a`, il sera ouvert en mode *append* (les écritures seront ajoutées à la fin, et n'effaceront pas le contenu si il y en a un).

Il y a d'autres options mais ces trois là sont les plus importantes.

Ce programme ouvre `texte.txt` en écriture, en ajoutant les données à la fin du fichier :

```c
#include <stdio.h>

int main() {
    FILE *fichier = fopen("texte.txt", "wa");

    return 0;
}
```

Comme cette fonction renvoie un pointeur, il peut potentiellement être nul. Ça arrivera
quand le fichier ne pourra pas être ouvert, par exemple parce qu'on a pas
les permissions suffisantes pour le lire. Il vaut mieux mettre une vérification
après avoir ouvert un fichier, pour éviter d'avoir un programme qui plante :

```c
FILE *fichier = fopen("texte.txt", "wa");
if (fichier == NULL) {
    printf("Erreur lors de l'ouverture de texte.txt\n"); // On affiche une erreur
    return 1; // Puis on quitte le programme, mais sans planter
}

// Ici on sait que fichier n'est pas nul, on peut l'utiliser sans souci
```

Les fonctions pour lire et écrire un fichier sont (respectivement) `fscanf` et `fprintf`.
Elles ressemblent beaucoup à `scanf` et `printf` mais elles prennent un `FILE *` en
premier argument, pour indiquer dans quel fichier lire ou écrire. À part ça, rien ne
change par rapport à `scanf` et `printf`.

Il faut aussi savoir que quand on lit ou écrit dans un fichier, le programme
se souvient d'où il en est, et on ne peut pas revenir en arrière (pour être honnête, on
peut mais on ne verra pas comment faire ici, regardez la fonction `fseek` si vous êtes curieu⋅euse⋅x).
Pour savoir si on a atteind la fin du fichier on peut utiliser `feof` (« EOF » signifie « *end of file* », « fin de fichier »).

Par exemple, on peut lire un fichier et afficher des étoiles à la place des
`a` avec ce code :

```c
#include <stdio.h>

int main() {
    // On ouvre le fichier (et on quitte avec une erreur si ça se passe mal)
    FILE *fichier = fopen("texte.txt", "r");
    if (fichier == NULL) {
        printf("Impossible d'ouvrir le fichier\n");
        return 1;
    }

    char c = ' ';
    while (!feof(fichier)) { // Tant qu'on est pas à la fin
        // On lit caractère par caractère
        fscanf(fichier, "%c", c);

        // On affiche le caractère (ou une étoile si c'est un « a »)
        if (c == 'a') {
            printf("*");
        } else {
            printf("%c", c);
        }
    }

    return 0;
}
```

Dernier point à savoir sur les fichiers : une fois qu'on a fini de les utiliser
il faut utiliser `fclose` pour signaler au système d'exploitation qu'on ne
va plus s'en servir. Il pourra alors laisser d'autres programmes utiliser ce même fichier.

Si on oublie de faire un `fclose`, le système d'exploitation attendra que notre programme se
termine pour « fermer » le fichier. Ce n'est pas très grave quand on écrit des programmes
courts comme ici, mais si on en fait qui tournent pendant plus longtemps, ça peut poser problème.

Bien-ŝur, une fois qu'on a fermé un fichier, on n'a plus le droit de lire ou d'écrire dedans.

## Bonus : le terminal est un fichier

Les système d'exploitation UNIX ont une sorte d'obcession
avec les fichiers, et ils ont tendance à tout voir comme des
fichiers : votre processeur est un fichier, une connexion vers
un site internet est un fichier, etc.

Et l'entrée et la sortie standard (en gros : le terminal et le clavier)
des programmes sont aussi des fichiers ! C'est très pratique, parce
qu'on peut écrire des programmes « indépendants » d'un nom de fichier.

Pour utiliser ces fichiers spéciaux, on n'utilise pas `fopen`, mais
les constantes spéciales `stdin` (**st**an**d**ard **in**put, « entrée standard », le clavier)
et `stdout` (**st**an**d**ard **out**put, « sortie standard », le texte du terminal).
Ces constantes viennent aussi de `stdio.h`.

Ce programme par exemple ouvre un fichier si on en précise un dans ses
arguments, sinon il utilise la sortie standard.

```c
#include <stdio.h>

int main(int argc, char **argv) {
    // On essaie d'ouvrir le fichier si il a été précisé en argument
    FILE *fichier = NULL;
    if (argc > 1) {
        fichier = fopen(argv[1], "r");
    }
    
    // Si l'ouverture a raté ou s'il n'y avait juste pas d'argument,
    // on utilise stdin
    if (fichier == NULL) {
        fichier = stdin;
    }

    // On affiche le contenu du fichier
    // Si le fichier est stdin, ça va juste répéter
    // ce qu'on tape jusqu'à ce qu'on fasse Ctrl+D ou Ctrl+C.
    // On considère que le fichier ne contient que des nombres les uns
    // à la suite des autres.
    while(!feof(fichier)) {
        int x = 0;
        scanf(fichier, "%d", &x);

        printf("%d\n", x);
    }

    return 0;
}
```
