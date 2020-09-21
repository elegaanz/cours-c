+++
title = "printf et scanf"
description = "Lire et écrire du texte dans le terminal"
weight = 1

[extra]
illus = "illus.webp"
+++

Le fichier `stdio.h` contient des fonctions pour gérer les entrées et sorties standards (**st**an**d**ard **i**nputs and **o**utputs).7Les entrées et les sorties standard, ça peut se résumer au fichiers et au terminal (techniquement sous UNIX le terminal est
un fichier aussi, mais on verra ça plus tard).

Comme on peut gérer à la fois les entrées et les sorties avec ces fonctions, on va pouvoir à la fois *lire* et *écrire*
du texte dans le terminal et dans les fichiers.

Pour utiliser les fonctions de `stdio.h`, il faut l'inclure dans notre fichier :

```c
#include <stdio.h>

int main() {
    // on peut utiliser les fonctions de stdio.h ici !
    return 0;
}
```

On va commencer par les deux fonctions qui permettent de lire et écrire dans le terminal : `printf` et `scanf`.

## Afficher du texte printf

La fonction `printf` permet d'afficher du texte et des variables suivant un format défini (le **f** dans `printf` est pour « *format* »).

On va commencer par afficher du texte, sans variables au milieu. On peut juste donner une chaîne de caractère et `printf`
l'affichera :

```c
// dans la fonction main
printf("Bonjour !\n");
```

Cette fonction, comme toutes les fonctions de `stdio` que nous allons utiliser n'ajoute pas de retour à la ligne automatiquement,
il faut donc finir la chaîne par un `\n`.

On peut utiliser une chaîne de caractère spéciale pour afficher la valeur de variables. Le premier argument de `printf` est toujours une chaîne de caractère, mais on marque les endroits où on veut que nos variables apparaissent avec des séquences spéciales.
Ces séquences sont composées d'un `%` suivant d'une lettre qui indique comment interpréter la variable à afficher.

Les principales lettres à connaître sont :

- `d` pour les nombres en base **d**ix ;
- `c` pour les **c**aractères ;
- `f` pour les **f**lottants ;
- `s` pour les chaînes de caractère (**s**tring) ;

Les variables à afficher viennent ensuite dans les arguments de `printf`. Elles doivent être
dans le même ordre que leur emplacement dans la chaîne. Voici un exemple qui affiche deux variables :

```c
// toujours dans la fonction main
int age = 19;
char *nom = "Corrèze";

printf("Le département numéro %d est la %s !", age, nom);
```

### Pourquoi est-ce que c'est si compliqué ?

On pourrait se demander pourquoi on ne peut pas juste additionner les chaînes, comme en Python :

```python
ville = "Grenoble"
print("Bienvenue à " + ville + " !")

# ou
print("Bienvenue à", ville, "!")
```

Mais la façon dont fonctionne le C fait que c'est bien plus simple d'utiliser la technique
des chaînes de caractères avec des `%`. On est aussi obligés de mettre une lettre après
ces `%` parce que même si nos variables ont un type connu au moment de la compilation
(et donc on pourrait savoir qu'un `int` doit s'afficher comme un nombre décimal, et un `char *`
comme une chaîne de caractères, etc), cette information de type est perdue dès qu'on compile et
donc quand notre fonction est appelée, on ne sait plus quelle variable est de quel type. En plus
de ça, on peut choisir d'utiliser différentes représentations pour un même type : par exemple
les nombres sont souvent affichés en base 10, mais quand on fait de l'informatique ça peut être
utile de les afficher en binaire (avec `%b`) ou en héxadécimal (avec `%x`).

Bref, cette façon un peu compliquée d'écrire un `print` est un mal nécessaire, et est parfois utile
quand on veut choisir une représentation différente de celle par défaut.

## Lire du texte

On va maintenant voir comment utiliser `scanf` pour lire du texte tapé au clavier.

Cette fonction est similaire à `printf` : le premier argument est aussi une chaîne
indiquant le format attendu, puis on a les variables qui correspondent à chacun des `%`.

La différence est que `scanf` va écrire ce qui a été lu dans ces variables au lieu de les lire
pour les afficher. Il faut donc passer des pointeurs vers ces variables, sinon leur valeur sera
copiée pour `scanf` et elles ne pourront pas vraiment être modifiées.

Ça veut aussi dire que nos variables n'ont pas spécialement besoin d'être initialisées, puisque `scanf`
va normalement changer leur valeur de toute façon.

Voici un exemple qui permet de lire un nombre au clavier :

```c
int nombre;
scanf("%d", &nombre);

printf("Vous avez écrit %d\n", nombre);
```

Maintenant, que ce passe-t-il si ce qui est tapé ne correspond pas au format demandé ? Par exemple si
on tape `abcd` dans l'exemple ci-dessus, qu'est-ce qui est affiché à la fin ? La réponse est que la ou
les variables qui devaient être modifiées ne le seront pas.

Dans le cas où les variables ne sont pas initialisées ça peut être assez grave : même sans valeur précise,
de la place en mémoire est réservée pour chaque variable. Le souci c'est que cette mémoire peut avoir servi
à d'autre choses avant, et donc les valeurs par défaut des variables non-initialisées ne sont pas forcément
celles auxquelles on peut s'attendre.

Ce programme par exemple, fait une démonstration très simple de comment une faille de sécurité
peut arriver à cause de ce problème :

```c
#include <stdio.h>

void a() {
    int x = 1234;
}

void b() {
    int y;
    printf("Tapez le code secret : ");
    scanf("%d", &y);
    if (y == 1234) {
        printf("Code secret correct.\n");
    } else {
        printf("Code secret incorrect.\n");
    }
}

int main() {
    a();
    b();
    return 0;
}
```

Quand on le compile avec `clang faille.c` et qu'on l'exécute, si on tape quelque chose
qui ne sera pas reconnu comme du texte par `scanf` quand on nous demande le code secret,
`y` aura une valeur non-initialisée. Le souci est que dans ce cas précis, la mémoire qui correspond
à `y` dans la fonction `b` est celle qui correspondait à `x` dans la fonction `a`, soit 1234, donc le code
secret est correct si on tape n'importe quoi !

Bref, cet exemple très long est là pour dire : il vaut mieux donner une valeur par défaut à ses
variables (que ça soit pour les utiliser avec `scanf` ou pas d'ailleurs), sinon notre programme
peut faire des choses auxquelles on ne s'attend pas.

Un autre cas où on peut avoir des formats qui ne correspondent pas avec ce qui a été tapé est quand 
on met plus que juste un `%` et une lettre. Par exemple, on peut demander de taper `x = ` avant de
taper un nombre avec :

```c
int x = 0;
scanf("x = %d", &x);
```

Mais si on ne tape pas `x = ` avant, `x` ne sera pas modifié.
