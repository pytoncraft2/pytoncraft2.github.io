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
const MAIN_COLOR = 0xff9800;
let groupeCategories, quiz, score, titre_question, screenCenterX, screenCenterY;

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
    const infoTexte = txt(scene, screenCenterX, screenCenterY - 370, "Choisir une catégorie de question");
    const { width } = scene.sys.game.canvas;
    this.titre_question = txt(scene, screenCenterX, 110, "").setWordWrapWidth(width)
    this.titre_question.setOrigin(0.5)

    //ajout des boutons dans un groupe avec le nom de la catégorie
    groupeCategories = this.add.group();

    groupeCategories.add(infoTexte)

    //stockage des titre des catégories dans un groupe
    Object.entries(quiz).map((v, i) => {
        const btn = txt(scene, screenCenterX, screenCenterY, v[0], ...[,], true, () => commencerQuestion(v[0], this))
        groupeCategories.add(btn)
    });

    //alignement verticale du groupe des catégories
    centrer(groupeCategories.getChildren(), screenCenterX, screenCenterY / 2 - 40, 0, 60)
    groupeCategories.getFirst(true).setY(80);
}

function commencerQuestion(categorie, self) {
    //cache les boutons d'acceuil (catégories)
    groupeCategories.toggleVisible()
    categorieChoisie = quiz[categorie]
    const totalQuestion = Object.keys(quiz[categorie]).length;
    
    score = txt(self, 10, 10, "");
    score.setData('score', 0);

    //affiche les résultas vrai ou faux répondu ou non sous forme de points
    const points = [];
    for (let key in Object.keys(quiz[categorie]))
        points.push("⚫");

    self.scoreTotal = txt(self, screenCenterX, 37, points.join(' ')).setAlpha(0.7).setOrigin(0.5).setAlign('center');
    self.scoreTotal.points = points;

    //!2
    afficherQuestion(categorieChoisie, self, 0, totalQuestion)
}

function afficherQuestion(categorieChoisie, scene, index, max) {
    if ((max - index) == 0) return finDePartie(scene, max, categorieChoisie)
    groupeCategories.clear();
    const groupReponse = scene.add.group();

    //affichage avec transition du titre de la question
    animation(scene, scene.titre_question, ...[,], () => {
        scene.titre_question.setText(categorieChoisie[index].titre);
        animation(scene, groupReponse.getChildren(), { alpha: 1, delay: 130, duration: 200 })
    })

    //map dans les reponses possible
    categorieChoisie[index].reponse.map((element, i) => {
        const btnReponse = txt(scene, screenCenterX, screenCenterY - 100, element, ...[,], true, () => {
            groupReponse.propertyValueSet("alpha", 0);
            if (categorieChoisie[index].indexBonneReponse === i) { score.data.list.score += 1; scene.scoreTotal.points[index] = "✅"; }
            else scene.scoreTotal.points[index] = "❌";
            scene.scoreTotal.text = scene.scoreTotal.points.join(' ')
            //!3
            afficherQuestion(categorieChoisie, scene, index + 1, max);
        }).setAlpha(0);
        groupReponse.add(btnReponse)
    });

    groupeCategories.add(scene.titre_question)
    centrer(groupeCategories.getChildren(), screenCenterX, screenCenterY / 2)
    centrer(groupReponse.getChildren(), screenCenterX, screenCenterY - screenCenterY / 2 + 130, 0, 80)
}


//COMPOSANTS
function finDePartie(scene, max, categorieChoisie) {
    //!4
    scene.titre_question.text = ""
    //affiche score
    const text_score = txt(scene, screenCenterX, screenCenterY -30, `Votre score ${score.getData('score')}/` + max).setAlpha(0);
    const groupeResultatTitre = scene.add.group();
    const groupeResultatReponse = scene.add.group();

    const ancienResultat = scene.scoreTotal.text.split(' ');
    const { width } = scene.sys.game.canvas;
    categorieChoisie.map((v, i) => {
        const couleur = ancienResultat[i] == "✅" ? '#049f21' : '#ff0000';
        const titre = txt(scene, screenCenterX, screenCenterY, [v.titre]).setShadow(2, 2, "#333333", 2, true, true).setAlign('center').setWordWrapWidth(width).setFontSize(23)
        const reponse = txt(scene, screenCenterX, screenCenterY, [v.reponse[v.indexBonneReponse]]).setShadow(2, 2, "#333333", 2, true, true).setColor(couleur).setFontSize(23)
        groupeResultatTitre.add(titre)
        groupeResultatReponse.add(reponse)
    })
    centrer(groupeResultatTitre.getChildren(), screenCenterX, screenCenterY / 2 + 200, 0, 60)
    centrer(groupeResultatReponse.getChildren(), screenCenterX, screenCenterY / 2 + 225, 0, 60)

    animation(scene, text_score, {y: "-=40", alpha: 1, duration: 300})

    //Redémarre la scene au clique
    const rejouer = txt(scene, screenCenterX, screenCenterY + 400, "Rejouer", ...[,], true, () => scene.scene.restart());
}

function animation(scene, target, params = { scale: "-=0.02", alpha: 0, duration: 200, yoyo: true }, cb = () => {}, cb2 = () => {}) {
    scene.tweens.add({
        targets: target,
        ...params,
        onYoyo: () => cb(),
        onComplete: () => cb2()
    })
}

function txt(scene, x, y, text, params = { fontFamily: "FFFTusj", fontSize: 30, color: ' #ffffff', wordWrap: { width: window.innerWidth } }, interactif = false, cb = () => { }) {
    const textCreer = scene.add.text(x, y, text, { ...params }).setOrigin(0.5, 0.5)
    interactif && textCreer
        .setInteractive({ cursor: 'pointer' })
        .once("pointerdown", (ev, go, event) => cb())
        .on('pointerover', function () { this.setTint(MAIN_COLOR); })
        .on('pointerout', function () { this.clearTint(); });
    return textCreer;
}

centrer = (cible, x, y) => Phaser.Actions.SetXY(cible, x, y, 0, 60);