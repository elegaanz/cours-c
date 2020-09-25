+++
title = "Résumé"
weight = 4
description = "Un résumé des différentes fonctions de stdio."
+++

On peut résumer les différentes fonctions de `stdio` ainsi :

| Sur quoi on opère ?       | Écrire (`printf`) | Lire (`scanf`) |
|---------------------------|-------------------|----------------|
| Entrée ou sortie standard | `printf`          | `scanf`        |
| Fichiers (préfixe : `f`)  | `fprintf`         | `fscanf`       |
| Chaîne (préfixe : `s`)    | `sprintf`         | `sscanf`       |

En plus de ça, on a trois fonctions spécifiques aux fichiers :

- `fopen` pour lire ouvrir un fichier ;
- `feof` pour savoir si on l'a lu jusqu'à la fin (*EOF* veut dire « *enf of file* ») ;
- `fclose` pour fermer le fichier une fois qu'on en a plus besoin.

