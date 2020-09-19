+++
title = "Pourquoi la compilation ?"
description = "Ce chapitre compare compilation et interprétation et explique les avantages et les inconvénients de ces deux méthodes."
weight = 1

[extra]
illus = "illus.webp"
+++

Pour lancer un programme en C, on a d'abord besoin d'une étape
intermédiaire, qui s'appelle la **compilation**.

Pour comprendre comment cette étape fonctionne, et pourquoi
elle est nécessaire en C, il faut d'abord parler du fonctionnement
d'un ordinateur, et plus particulièrement de celui du processeur.

Le processeur est la pièce centrale de l'ordinateur (en anglais on les
appelle d'ailleurs *CPU*, pour *Central Computing Unit*), c'est là que se passent
tous les calculs et que nos programmes « tournent ». Pour savoir ce qu'on
lui demande de faire, le processeur lit une suite d'instruction codées en binaire.
Chaque instruction a un numéro, le processeur lit ce numéro, exécute l'instruction associée
(par exemple faire une addition, ou comparer deux valeurs pour savoir si elles sont égales, etc),
et passe à l'instruction suivante, et ainsi de suite jusqu'à ce qu'il arrive à la fin du programme.

Dans les langages interprétés, comme Python, on a un programme qui lit notre
code et le traduit en instructions en binaire pour le processeur juste au moment où
l'instruction doit être exécutée. Cette technique a un avantage : tous les processeurs
n'utilisent pas les mêmes *jeu d'instructions*, c'est-à-dire les même nombres binaires
pour coder une même opération : ce que votre PC comprendrait comme une addition pourrait
être lu comme une multiplication par votre téléphone par exemple.
En traduisant au dernier moment le code comme le fait Python, on peut savoir quel
type de processeur on a, et donc utiliser le code d'instruction qui est correct,
sans avoir à faire plusieurs versions de son programme.

La compilation au contraire, transforme le code en binaire en avance.
Quand on lance notre programme, il est chargé dans la mémoire de l'ordinateur
et on indique au processeur de lire les instructions qui se trouvent à tel
endroit dans la mémoire sans se poser de questions. C'est donc beaucoup plus rapide,
car tout le code est déjà traduit en binaire, mais ça demande de compiler différentes
versions du programme, une pour chaque type de processeur.

Il y a d'autres subtilités qui font que la compilation et l'interprétation de programme
sont différentes, mais l'essentiel est là.

Ce qu'il faut retenir c'est que la compilation donne des programmes plutôt plus rapides, et que les programmes compilés peuvent être compris directement par le processeur, sans avoir besoin d'un autre programme pour fonctionnner (par exemple si vous n'avez pas installé Python sur votre ordinateur vous ne pourrez pas lancer de code Python, alors que si vous n'avez pas installé CLang ou autre vous pourrez toujours lancer un programme C déjà compilé).
