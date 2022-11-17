window.verificationMobile = function() {
  let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor);
  return check;
};

const scale = () => {
    if (window.verificationMobile()) return { mode: Phaser.Scale.RESIZE }
    else return { mode: Phaser.Scale.ScaleModes.FIT, autoCenter: Phaser.Scale.Center.CENTER_BOTH }
}

const config = {
    type: Phaser.AUTO,
    parent: "parent",
    scale: scale(),
    width: 600,
    height: 890,
    transparent: true,
    physics: {
        default: 'arcade'
    },
    scene: { preload, create, },
    autoCenter: true
}

const game = new Phaser.Game(config);
// const MAIN_COLOR = 0xff9800;
const MAIN_COLOR = 0x000000;
const BLEU_PRIMAIRE = 0x006699;
let groupeCategories, quiz, score, titre_question, screenCenterX, screenCenterY, titreAccueil;

function preload() {
    this.load.json('questions', './assets/donnes/questions.json');
}

function create() {
    quiz = this.cache.json.get('questions');
    const scene = this;
    console.log(quiz);

    screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;



    //titre
    titreAccueil = texte(scene, screenCenterX, 40, "Choisir une catégorie de question").setFontStyle('bold italic');
    const { width } = scene.sys.game.canvas;
    this.titre_question = texte(scene, screenCenterX, 110, "").setWordWrapWidth(width)
    this.titre_question.setOrigin(0.5)

    //ajout des boutons dans un groupe avec le nom de la catégorie
    groupeCategories = this.add.group();

    //stockage des titre des catégories dans un groupe
    Object.entries(quiz).map((v, i) => {
        const btn = texte(scene, screenCenterX, screenCenterY, v[0], ...[,], () => commencerQuestion(v[0], this))
        groupeCategories.add(btn)
    });

    //alignerment verticale du groupe des catégories
    aligner(groupeCategories.getChildren(), screenCenterX, 125)
}

function commencerQuestion(categorie, self) {
    //cache le titre et les boutons d'acceuil (catégories)
    groupeCategories.toggleVisible()
    titreAccueil.destroy()
    categorieChoisie = quiz[categorie]

    const totalQuestion = Object.keys(quiz[categorie]).length;
    
    score = texte(self, 10, 10, "");
    score.setData('score', 0);

    //affiche les résultas vrai ou faux répondu ou non sous forme de points
    const points = [];
    for (let key in Object.keys(quiz[categorie])) points.push("⚫");

    self.scoreTotal = texte(self, screenCenterX, 37, points.join(' ')).setAlpha(0.7).setOrigin(0.5).setAlign('center');
    self.scoreTotal.points = points;

    //!2
    afficherQuestion(categorieChoisie, self, 0, totalQuestion)
}

function afficherQuestion(categorieChoisie, scene, index, max) {
    if ((max - index) == 0) return finDePartie(scene, max, categorieChoisie)
    groupeCategories.clear();
    const groupReponse = scene.add.group();
    const groupTexte = scene.add.group();

    //affichage avec transition le titre de la question
    animation(scene, scene.titre_question, ...[,], () => {
        scene.titre_question.setText(categorieChoisie[index].titre);
        animation(scene, groupReponse.getChildren(), { alpha: 1, delay: 130, duration: 200, delay: function (target, targetKey, value, targetIndex, totalTargets, tween) { return targetIndex * 100; }})
        animation(scene, groupTexte.getChildren(), { scale: 1, alpha: 1, delay: 130, duration: 200, delay: function (target, targetKey, value, targetIndex, totalTargets, tween) { return targetIndex * 100; }})
    })

    //map dans les reponses possible
    const { width } = scene.sys.game.canvas;
    // var r1 = scene.add.rectangle(screenCenterX, screenCenterY - 80, width, 50, 0x000000).setAlpha(0.9);
    // var r2 = scene.add.rectangle(screenCenterX, screenCenterY, width, 50, 0x000000).setAlpha(0.9);
    // var r3 = scene.add.rectangle(screenCenterX, screenCenterY + 80, width, 50, 0x000000).setAlpha(0.9);
    // var r4 = scene.add.rectangle(screenCenterX, screenCenterY - 160, width, 50, 0x000000).setAlpha(0.9);
    let base = 280;
    
    categorieChoisie[index].reponse.map((element, i) => {
        console.log(element);
        var btnReponse = scene.add.rectangle(screenCenterX, base, width, 50, 0x000000)
        .setInteractive({cursor: 'pointer'})
        .on('pointerover', function () { this.fillColor = BLEU_PRIMAIRE; this.fillAlpha = 0.7; })
        .on('pointerout', function () { this.fillColor = 0x0000; this.fillAlpha = 1; })
        .once('pointerdown', function () {
                    if (categorieChoisie[index].indexBonneReponse === i) {
                        // score.data.list.score += 1;
                        scene.scoreTotal.points[index] = "✅";
                        scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
                        console.log(scene.scoreTotal.points);
                        this.fillColor = 0x008000;
                        console.log(this.text);
                        // this.text.text += " ✅"

                        var timer = scene.time.delayedCall(200, () => {
                            groupReponse.getChildren().forEach(element => {
                                element.text.destroy()                                
                            });
                            groupReponse.destroy(true)
                            afficherQuestion(categorieChoisie, scene, index + 1, max);
                        }, undefined, this);  // delay in ms

                    //  animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {delay: 100, alpha: 0, duration: 100, repeat: 1}, () => {}, () => {
                        // groupReponse.destroy(true)
                        // afficherQuestion(categorieChoisie, scene, index + 1, max);
                    // })               
                    }
                    else {
                        scene.scoreTotal.points[index] = "❌";
                        // categorieChoisie[index].reponseDonne = element;
                        // this.setStyle({ backgroundColor: '#ff0000' });
                        this.fillColor = 0xff0000;
                        // this.text.text += " ❌"
                    // animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {delay: 1000, scale: '+=0.5', yoyo: true, duration: 300, repeat: 1}, () => {}, () => {
                        // groupReponse.destroy(true)
                        groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse].fillColor = 0x008000;
                        animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {alpha: 0, duration: 500, repeat: 2, scale: 1.3});
                        // animation(scene, this, {alpha: 0, duration: 1000})
                        var timer = scene.time.delayedCall(1000, () => {
                            scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
                            groupReponse.getChildren().forEach(element => {
                                element.text.destroy()                                
                            });
                            groupReponse.destroy(true)
                            // groupReponse.destroy(true)
                            afficherQuestion(categorieChoisie, scene, index + 1, max);
                        }, undefined, this);  // delay in ms
                    // })

                    }
                //     scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
                //     // animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], undefined, () => {}, () => {
                //     //     groupReponse.destroy(true)
                //     //     afficherQuestion(categorieChoisie, scene, index + 1, max);
                //     // })
                //     // groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse].setAlpha(0.2)
                //     //     var timer = scene.time.delayedCall(800, () => {
                //     //         groupReponse.destroy(true)
                //     //         //!3
                //     //         afficherQuestion(categorieChoisie, scene, index + 1, max);
                //     //     }, undefined, this);

                //     // afficherQuestion(categorieChoisie, scene, index + 1, max);
            })
        .setAlpha(0.1);
        btnReponse.text = scene.add.text(screenCenterX, base, element, { fontFamily: "FFFTusj", fontSize: 30, color: ' #ffffff', wordWrap: { width: window.innerWidth } }).setOrigin(0.5, 0.5).setAlpha(0.1)
        groupTexte.add(btnReponse.text)
        base+=80;
        // const btnReponse = texte(scene, screenCenterX, screenCenterY - 100, element, ...[,], (bouton) => {
        //     if (categorieChoisie[index].indexBonneReponse === i) {
        //         score.data.list.score += 1;
        //         scene.scoreTotal.points[index] = "✅";
        //         bouton.setStyle({ backgroundColor: '#008000' });

        //      animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {delay: 100, alpha: 0, duration: 100, repeat: 1}, () => {}, () => {
        //         groupReponse.destroy(true)
        //         afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     })               
        //     }
        //     else {
        //         scene.scoreTotal.points[index] = "❌";
        //         categorieChoisie[index].reponseDonne = element;
        //         bouton.setStyle({ backgroundColor: '#ff0000' });
        //     animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {delay: 1000, scale: '+=0.5', yoyo: true, duration: 300, repeat: 1}, () => {}, () => {
        //         groupReponse.destroy(true)
        //         afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     })

        //     }
        //     scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
        //     // animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], undefined, () => {}, () => {
        //     //     groupReponse.destroy(true)
        //     //     afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     // })
        //     // groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse].setAlpha(0.2)
        //     //     var timer = scene.time.delayedCall(800, () => {
        //     //         groupReponse.destroy(true)
        //     //         //!3
        //     //         afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     //     }, undefined, this);

        //     // afficherQuestion(categorieChoisie, scene, index + 1, max);
        // }).setAlpha(0);
        // btnReponse.text = texte(scene, screenCenterX, screenCenterY - 100, element, ...[,], (bouton) => {

            // if (categorieChoisie[index].indexBonneReponse === i) {
        //         score.data.list.score += 1;
                // scene.scoreTotal.points[index] = "✅";
        //         bouton.setStyle({ backgroundColor: '#008000' });

        //      animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {delay: 100, alpha: 0, duration: 100, repeat: 1}, () => {}, () => {
        //         groupReponse.destroy(true)
        //         afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     })               
            // }
            // else {
                // scene.scoreTotal.points[index] = "❌";
        //         categorieChoisie[index].reponseDonne = element;
        //         bouton.setStyle({ backgroundColor: '#ff0000' });
        //     animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], {delay: 1000, scale: '+=0.5', yoyo: true, duration: 300, repeat: 1}, () => {}, () => {
        //         groupReponse.destroy(true)
        //         afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     })

            // }
        //     scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
        //     // animation(scene, groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse], undefined, () => {}, () => {
        //     //     groupReponse.destroy(true)
        //     //     afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     // })
        //     // groupReponse.getChildren()[categorieChoisie[index].indexBonneReponse].setAlpha(0.2)
        //     //     var timer = scene.time.delayedCall(800, () => {
        //     //         groupReponse.destroy(true)
        //     //         //!3
        //     //         afficherQuestion(categorieChoisie, scene, index + 1, max);
        //     //     }, undefined, this);

        //     // afficherQuestion(categorieChoisie, scene, index + 1, max);
        // })
        groupReponse.add(btnReponse)
    });

    groupeCategories.add(scene.titre_question)
    aligner(groupeCategories.getChildren(), screenCenterX, screenCenterY / 2)
    // aligner(groupReponse.getChildren(), screenCenterX, screenCenterY - screenCenterY / 2 + 130, 0, 80)
}

function finDePartie(scene, max, categorieChoisie) {
    //!4
    scene.titre_question.text = ""
    //affiche score
    const text_score = texte(scene, screenCenterX, 150, `Votre score ${score.getData('score')}/` + max).setAlpha(0);
    const groupeResultatQuestionReponse = scene.add.group();

    const { width } = scene.sys.game.canvas;
    categorieChoisie.map((v, i) => {
        const couleur = v.reponseDonne ? '#ff0000' : '#049f21';
        const titre = texte(scene, screenCenterX, screenCenterY, [v.titre, [v.reponse[v.indexBonneReponse].concat(v.reponseDonne ? ` ⬅️ ${v.reponseDonne}` : '  ✅')]]).setShadow(2, 2, couleur, 2, true, true).setAlign('center').setWordWrapWidth(width).setFontSize(23)
        groupeResultatQuestionReponse.add(titre)
    })
    aligner(groupeResultatQuestionReponse.getChildren(), screenCenterX, 200, 0, 100)
    animation(scene, text_score, {y: "-=40", alpha: 1, duration: 300})

    //Redémarre la scene au clique
    const { height } = scene.sys.game.canvas;
    const rejouer = texte(scene, screenCenterX, height - 50, "Rejouer", ...[,], () => scene.scene.restart()).setScrollFactor(0);
}

//UTILITAIRES
function animation(scene, target, params = { scale: "-=0.02", alpha: 0, duration: 200, yoyo: true }, cb = () => {}, cb2 = () => {}) {
    scene.tweens.add({
        targets: target,
        ...params,
        onYoyo: () => cb(target),
        onComplete: () => cb2(target)
    })
}

function texte(scene, x, y, text, params = { fontFamily: "FFFTusj", fontSize: 30, color: ' #ffffff', wordWrap: { width: window.innerWidth } }, callback = undefined) {
    const textCreer = scene.add.text(x, y, text, { ...params }).setOrigin(0.5, 0.5)
    callback && textCreer
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: '#111'})
        .setInteractive({ cursor: 'pointer' })
        .once("pointerdown", (ev, go, event) => callback(textCreer))
        .on('pointerover', function () { this.setTint(MAIN_COLOR); })
        .on('pointerout', function () { this.clearTint(); });
    return textCreer;
}

aligner = (cible, x, y, stepX = 0, stepY = 60) => Phaser.Actions.SetXY(cible, x, y, stepX, stepY);