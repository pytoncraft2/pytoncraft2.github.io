/**
 * @author Timothée Hennequin @timd57
 * @date 30/12/2022
 * @file [(jeu.js)](./jeu.js) fichier racine du jeu. [jouer au quiz 🎮](https://pytoncraft2.github.io/2/).
 * @version 0.1.0
 * @module JEU
 */

import { texte, animation, aligner, rectangleInteractif, scale } from "./utilitaires.js";

let groupeBoutonsCategories, quizParCategorie, texteScore, centreEcranX, centreEcranY, titreAccueil;

function preload() {
    this.load.json('questions', './assets/questions.json');
}

/**
 * @memberof module:JEU
 * 
 * @description
 * <h3 style="color: lightseagreen;""><em><u>Affiche page d'accueil</u></em></h3>
 * <b>1</b>. Récupère le <a href="/assets/questions.json" target="_blank">fichier json</a><br>
 * <b>2</b>. Regroupe les questions par catégorie dans un nouvelle objet accessible publiquement<br>
 * <b>3</b>. Liste les catégories en bouton et commence le questionnaire au clique<br>
 * <b>4</b>. Affiche le titre de l'acceuil<br>
 * <b>5</b>. Ajoute et rend invisble l'image et le titre de la question pour quelle soit utilisable plus tard dans les questions<br>
 */
function create() {
    const quiz_fichier = this.cache.json.get('questions');

    // regroupe les questions par catégories
    quizParCategorie = quiz_fichier.reduce((acc, obj) => {
        return { ...acc, [obj.categorie]: [...acc[obj.categorie] || [], obj] }
    }, {});
    quizParCategorie["Au hasard"] = quiz_fichier.sort(() => Math.random() - 0.5);

    const scene = this;

    centreEcranX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    centreEcranY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    //titre
    titreAccueil = texte(scene, centreEcranX, 40, "Choisir une catégorie de question").setFontStyle('bold italic');
    const { width } = scene.sys.game.canvas;
    this.titre_question = texte(scene, centreEcranX, 160, "").setWordWrapWidth(width - 5).setOrigin(0.5).setFontSize(23);

    this.image_question = this.add.image(centreEcranX, centreEcranY + 500, 'fond').setAlpha(0).setPosition(this.titre_question.x, this.titre_question.y + 15).setActive(false);

    //ajout des boutons dans un groupe avec le nom de la catégorie
    groupeBoutonsCategories = this.add.group();

    /**
     * stockage des titre des catégories dans un groupe
     * donnes[0] -> Titre de la catégorie
     * donnes[1] -> Tableau de questions
     */
    Object.entries(quizParCategorie).map((donnes) => {
        const container = scene.add.container(0, 0);
        const btnReponse = rectangleInteractif(scene, 0, 0, width, 50, () => commencerQuestion(donnes[0], scene));
        btnReponse.text = scene.add.text(0, 0, donnes[0], { fontFamily: "FFFTusj", fontSize: 26, color: ' #ffffff', wordWrap: { width: window.innerWidth } }).setOrigin(0.5, 0.5);
        container.add([btnReponse, btnReponse.text]);
        groupeBoutonsCategories.add(container)
    });

    aligner(groupeBoutonsCategories.getChildren(), centreEcranX, 125)
}



/**
 * @memberof module:JEU
 * 
 * @param {Object} categorie catégorie séléctionné
 * @param {Phaser.Scene} scene référence à la scene Phaser
 * 
 * @description <h3 style="color: lightseagreen;"><em><u>Initialise éléments</u></em></h3>
 * - Cache le titre + les boutons d'accueil<br>
 * - Initialise le texte de score avec des "⚫"<br>
 * - Précharge toutes les images de la catégorie sélectionné puis démarre le questionnaire<br>
 */
function commencerQuestion(categorie, scene) {
    //cache le titre et les boutons d'acceuil (catégories)
    groupeBoutonsCategories.toggleVisible()
    titreAccueil.destroy()
    var categorieChoisie = quizParCategorie[categorie]

    const totalQuestion = Object.keys(quizParCategorie[categorie]).length;

    texteScore = texte(scene, 10, 10, "");
    texteScore.setData('score', 0);

    //affiche les résultas vrai ou faux répondu ou non sous forme de points
    const points = [];
    for (let key in Object.keys(quizParCategorie[categorie])) points.push("⚫");

    scene.scoreTotal = texte(scene, centreEcranX, 37, points.join(' ')).setAlpha(0.7).setOrigin(0.5).setAlign('center').setFontSize(20);
    scene.scoreTotal.points = points;

    // préchargement des images de la catégorie séléctionné
    for (let key in categorieChoisie) {
        if (categorieChoisie[key].image)
        {
            scene.load.image(`${categorieChoisie[key].image}`, categorieChoisie[key].image)
        }
        scene.load.once(Phaser.Loader.Events.COMPLETE, () => {
            scene.image_question.setTexture(`${categorieChoisie[key].image}`)
            if (key == categorieChoisie.length - 1) {
                return afficherQuestion(categorieChoisie, scene, 0, totalQuestion);
            }
        })
        scene.load.start()
    }
}



/**
 * @memberof module:JEU
 * 
 * @param {Object} categorieChoisie objet contenant un tableau avec la liste des questions de la catégorie précédemment séléctionné<br>
 * @param {Phaser.Scene} scene référence à la scene Phaser
 * @param {Number} index index de la question courante
 * @param {Number} max nombre de question total
 * 
 * @description <h3 style="color: lightseagreen;""><em><u>Affiche le questionnaire</u></em></h3>
 * Affichage la page de fin de partie si on arrive au bout du quizParCategorie<br>
 * Création d'un groupe pour les réponses et le titre de la question<br>
 * Assigne la source de l'image si l'objet des question contient une url dans l'objet l'url d'une image<br>
 * Affiche l'image avec une animation si l'objet avec la clé <i>image</i> contient une valeur<br>
 * Affiche le titre de la question et la liste des choix avec une animation<br>
 * Transforme la chaine de charactère de l'objet choix en tableau le séparateur correspond à 2 espaces <br>
 * Implémente sur chaque bouton la logique pour les réponses juste/fausse au clique<br>
 * Change le score et les points en fonction de la réponse
 * 
 * @example
 * "choix 1,  choix 2,  choix 3,  choix 4".split(',  ')
 * //resultat
 * ["choix1", "choix2", "choix3", "choix4"]
 * 
 * afficherQuestion({
    "categorie": "Devises",
    "question": "Que veut dire la devise scout \"Toujours prêt\" ?",
    "choix": "Etre prêt en anticipant et en s'entraînant à réagir face à n'importe quel accident pour ne jamais être pris au dépourvu.,  Etre prêt à tout (voler, tricher) pour avoir son insigne.,  Etre prêt à ranger sa chambre, faire le ménage et d'autres corvées quand les parents le demandent.,  Rien en particulier, c'était un tic de langage de Robert Baden-Powell.",
    "indexBonneReponse": "0",
    "image": "./mon_image_d'accompagnement.png",
    "retour": "Devise de la branche éclaireur, elle est la traduction de l'anglais : Be prepared (BP, en abrégé, ce qui a toujours amusé Baden-Powell)"
}, scene, 0, 12)
*/
function afficherQuestion(categorieChoisie, scene, index, max) {
    if ((max - index) == 0) return finDePartie(scene, max, categorieChoisie)
    groupeBoutonsCategories.clear();
    const groupReponse = scene.add.group();
    const groupTexte = scene.add.group();

    //affichage avec transition le titre de la question
    animation(scene, scene.titre_question, ...[,], () => {
        if (categorieChoisie[index]?.image == "" && categorieChoisie[index].question) {
            scene.titre_question.setPosition(scene.titre_question.x, 160)
        }

        if (categorieChoisie[index]?.image != "" && categorieChoisie[index].question) {
            console.log("image et question");
            scene.image_question.setPosition(scene.image_question.x, 200)
            scene.titre_question.setPosition(scene.titre_question.x, 110)
        }

        if (categorieChoisie[index]?.image == "" && categorieChoisie[index].question == "") {
            console.log("question uniquement");
            scene.titre_question.setPosition(scene.titre_question.x, 180)
        }

        if (categorieChoisie[index]?.image != "") {
            scene.image_question.setTexture(`${categorieChoisie[index].image}`)
            animation(scene, scene.image_question, { alpha: 1, duration: 200 })
        }

        //responsivité du titre de la question
        scene.titre_question.text.length > 300 ? scene.titre_question.setFontSize(20) : scene.titre_question.setFontSize(23);
        scene.titre_question.setText(categorieChoisie[index].question);
        animation(scene, groupReponse.getChildren(), { alpha: 1, delay: 130, duration: 200, delay: function (target, targetKey, value, targetIndex, totalTargets, tween) { return targetIndex * 100; } })
        animation(scene, groupTexte.getChildren(), { scale: 1, alpha: 1, delay: 130, duration: 200, delay: function (target, targetKey, value, targetIndex, totalTargets, tween) { return targetIndex * 100; } })
    })

    const { width } = scene.sys.game.canvas;
    let base = 320;

    const MixArray = categorieChoisie[index].choix
    const string = MixArray.toString()
    const listeChoix = string.split(',  ')

    //map dans les reponses possible
    listeChoix.map((element, i) => {
        var btnReponse = rectangleInteractif(scene, centreEcranX, base, width, 50, (bouton) => {
                bouton.removeInteractive()
                if (categorieChoisie[index]?.indexBonneReponse == i)
                {
                    scene.scoreTotal.points[index] = "✅";

                    texteScore.setData('score', texteScore.getData('score') + 1);
                    scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
                    bouton.fillColor = 0x008000;

                    var timer = scene.time.delayedCall(200, () => {
                        groupReponse.getChildren().forEach(element => {
                            element.text.destroy()
                        });
                        groupReponse.destroy(true)
                        //suppression de l'image de la question si elle existe
                        categorieChoisie[index]?.image != "" && animation(scene, scene.image_question, { alpha: 0, duration: 200 });
                        afficherQuestion(categorieChoisie, scene, index + 1, max);
                    }, undefined, this);
                }
                else
                {
                    scene.scoreTotal.points[index] = "❌";
                    scene.cameras.main.shake(500);
                    bouton.fillColor = 0xff0000;
                }
        }).setAlpha(0);
        btnReponse.text = scene.add.text(centreEcranX, base, element, { fontFamily: "FFFTusj", fontSize: 30, color: ' #ffffff', wordWrap: { width: window.innerWidth } }).setFontSize(21).setOrigin(0.5, 0.5).setAlpha(0.1).setMaxLines(2);
        //responsivité texte
        if (btnReponse.text.text.length > 53) btnReponse.text.setWordWrapWidth(width, true);
        groupTexte.add(btnReponse.text)
        base += 80;
        groupReponse.add(btnReponse)
    });

    aligner(groupeBoutonsCategories.getChildren(), centreEcranX, centreEcranY / 2)
}



/**
 * @memberof module:JEU
 * 
 * @param {Phaser.Scene} scene référence à la scene Phaser
 * @param {Number} max total de question
 * @param {Object} categorieChoisie catégorie séléctionné 
 * 
 * @description <h3 style="color: lightseagreen;""><em><u>Affiche les résultats</u></em></h3>
 * Affiche le bouton <i>rejouer</i>
 */
function finDePartie(scene, max, categorieChoisie) {
    //!4
    scene.titre_question.text = ""
    //affiche score
    const text_score = texte(scene, centreEcranX, 150, `Votre score ${texteScore.getData('score')}/` + max).setAlpha(0);

    let base = 280;
    const { width } = scene.sys.game.canvas;
    categorieChoisie.map((v, i) => {
        const couleur = v.reponseDonne ? '#ff0000' : '#049f21';
        var btnReponse = scene.add.rectangle(centreEcranX, base, width, 50, couleur)
        btnReponse.text = scene.add.text(centreEcranX, base, v.choix[v.indexBonneReponse], { fontFamily: "FFFTusj", fontSize: 20, color: ' #ffffff', wordWrap: { width: window.innerWidth } }).setOrigin(0.5, 0.5);
        base += 80;
    })

    animation(scene, text_score, { y: "-=40", alpha: 1, duration: 300 })

    const { height } = scene.sys.game.canvas;
    //Redémarre la scene au clique
    const rejouer = texte(scene, centreEcranX, height - 50, "Rejouer", ...[,], () => scene.scene.restart()).setScrollFactor(0);
}


const config = {
    type: Phaser.AUTO,
    parent: "parent",
    scale: scale(),
    width: 600,
    height: 890,
    transparent: true,
    scene: { preload, create, },
    autoCenter: true
}

const game = new Phaser.Game(config);