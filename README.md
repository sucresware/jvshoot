# JVSHOOT

<p align="center"><img src="https://github.com/4sucres/jvshoot/raw/master/docs/preview.png" height="880"></p>

<p align="center">
<img alt="Discord" src="https://img.shields.io/discord/570066757021204515?label=discord&logo=discord&style=flat-square">
</p>

## À propos de JVSHOOT

Un space-shooter web dans l'univers JVlike, réalisé avec le moteur [Phaser](https://phaser.io/).

## Développement

```
git clone https://github.com/4sucres/jvshoot.git
cd jvshoot
npm install
npm start
```

Un onglet de navigateur sera ouvert sur un serveur local à l'adresse http://localhost:3000

### Version mobile (Cordova)

```
npm install -g cordova
cordova platform rm android
cordova platform add android # Generates build files
cordova run android
```

## Déploiement avec Deployer

[Deployer](https://deployer.org/) est pré-configuré au sein du projet pour permettre une mise en ligne rapide de la dernière version du jeu.

```
dep deploy
```

## Credits

https://github.com/lean/phaser-es6-webpack

https://github.com/jaredyork/CoursePhaser3SpaceShooter

https://cordova.apache.org/
