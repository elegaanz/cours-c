+++
title = "Exercices"
weight = 5
+++

## 1

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
