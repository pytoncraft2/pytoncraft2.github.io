/**
 * @file [(utilitaires.js)](./utilitaires.js) fichier de fonctions utilitaires (animation, texte, rectangle, etc...)
 * @author Timothée Hennequin
 * @date 20/12/2022
 * @module UTILITAIRES
 */

/**
 * @memberof module:UTILITAIRES
 * 
 * @param Phaser.Scene scene référence à la scene Phaser
 * @param {Phaser.GameObjects.GameObject} target objet à animer
 * @param {Object} [params] animation paramétrable
 * @param {string} [params.scale=-=0.02] échelle de l'objet
 * @param {number} [params.alpha=0] opacité
 * @param {number} [params.duration=200] durée de l'animation
 * @param {boolean} [params.yoyo=true] répétition de l'animation dans les deux sens
 * @param {CallableFunction} [callbackYoYo=()=>{}] évènement de retour au millieu de l'animation
 * @param {CallableFunction} [callbackFin=()=>{}]  évènement de retour à la fin de l'animation
 * 
 * @description Applique une animation sur un objet 💫 <br>
 * Un rappel de fonction au millieu et à la fin de l'animation sont possible<br>
 * 
 * @example
 * //animation avec opacité qui change
 * animation(scene, element, {alpha: 1, duration: 200}, () => console.log("milieu de l'animation"), () => console.log("fin de l'animation"))
 */
const animation = (scene, target, params = { scale: "-=0.02", alpha: 0, duration: 200, yoyo: true }, callbackYoYo = () => {}, callbackFin = () => {}) => {
    scene.tweens.add({
        targets: target,
        ...params,
        onYoyo: () => callbackYoYo(target),
        onComplete: () => callbackFin(target)
    })
}



/**
 * @memberof module:UTILITAIRES
 * 
 * @param {Phaser.Scene} scene référence à la scene Phaser 
 * @param {Number} x emplacement du texte sur l'axe X
 * @param {Number} y emplacement du texte sur l'axe Y
 * @param {String} text texte à afficher
 * @param {Object} [params] style du texte
 * @param {string} [params.fontFamily=FFFTusj] famille de police
 * @param {number} [params.fontSize=30] taille
 * @param {string} [params.color=#ffffff] couleur
 * @param {Object} [params.wordWrap] gestion du saut à la ligne
 * @param {number} [params.wordWrap.width] largeur maximum autorisé d'une ligne
 * @param {CallableFunction} [callback=undefined] évènement de retour au clique sur le texte
 * 
 * @description Génere du texte et peut optionnellement le rendre cliquable<br>
 * Si une fonction de rappel est spécifié en paramètre, celle-ci est exécuté au moment du clique<br>
 * 
 * @example texte(scene, 100, 100, "Bonjour", {color: "#ff0000"}, () => console.log("clique sur le texte"))
 * @returns Phaser.GameObjects.Text
 */
const texte = (scene, x, y, text, params = { fontFamily: "FFFTusj", fontSize: 30, color: ' #ffffff', wordWrap: { width: window.innerWidth } }, callback = undefined) => {
    const textCreer = scene.add.text(x, y, text, { ...params }).setOrigin(0.5, 0.5)
    callback && textCreer
        .setOrigin(0.5)
        .setPadding(10)
        .setStyle({ backgroundColor: '#111' })
        .setInteractive({ cursor: 'pointer' })
        .once("pointerdown", (ev, go, event) => callback(textCreer))
        .on('pointerover', function () { this.setTint(BLEU_PRIMAIRE); })
        .on('pointerout', function () { this.clearTint(); });
    return textCreer;
}



/**
 * @memberof module:UTILITAIRES
 * 
 * @param {Phaser.Scene} scene référence à la scene Phaser
 * @param {Number} x emplacement du rectangle sur l'axe X
 * @param {Number} y emplacement du rectangle sur l'axe Y
 * @param {Number} width longueur du rectangle
 * @param {Number} height largeur du rectangle
 * @param {CallableFunction} [callback=undefined] évènement de retour au clique sur le rectangle
 * 
 * @description Génere un rectangle et peut optionnellement le rendre cliquable<br>
 * Si une fonction de rappel est spécifié en paramètre, celle-ci est exécuté au moment du clique<br>
 * 
 * @example rectangleInteractif(scene, 100, 100, 200, 50, (bouton) => { console.log("action au clique sur le rectangle")})
 * @returns Phaser.GameObjects.Rectangle
 */
const rectangleInteractif = (scene, x, y, width, height, callback = undefined) => {
    const btn = scene.add.rectangle(x, y, width, height, "#ff0000")
        .setInteractive({ cursor: 'pointer' })
        .on('pointerover', function () { this.fillColor = BLEU_PRIMAIRE; this.fillAlpha = 0.7; })
        .on('pointerout', function () { this.fillColor = 0x0000; this.fillAlpha = 1; })
        .once('pointerdown', function () { callback(this) });
    return btn;
}



/**
 * @memberof module:UTILITAIRES
 * 
 * @param {Array|Array<Phaser.GameObjects.GameObject>} cible élément(s) à aligner
 * @param {Number} x emplacement du premier élément sur l'axe X
 * @param {Number} y emplacement du premier élément sur l'axe Y
 * @param {Number} [stepX=0] espacement entre les éléments sur l'axe X
 * @param {Number} [stepY=60] espacement entre les éléments sur l'axe Y
 * 
 * @description Aligne un ou plusieurs éléments avec espacement, voir {@link https://newdocs.phaser.io/docs/3.55.2/focus/Phaser.Actions.SetXY Phaser.Actions.SetXY} 
 * 
 * @example aligner([element1, element2, element3], 100, 100, 0, 60)
 */

const aligner = (cible, x, y, stepX = 0, stepY = 60) => Phaser.Actions.SetXY(cible, x, y, stepX, stepY);
const COULEUR_PRINCIPAL = 0xff9800;
const BLEU_PRIMAIRE = 0x006699;

/**
 * @memberof module:UTILITAIRES
 * @description change l'échelle de la fênetre en fonction de l'appareil
 * @returns {object} taille de la fenêtre agrandie en mobile et réduite en desktop
 */
const scale = () => {
    if (window.verificationMobile()) return { mode: Phaser.Scale.RESIZE }
    else return { mode: Phaser.Scale.ScaleModes.FIT, autoCenter: Phaser.Scale.Center.CENTER_BOTH }
}

/**
 * @memberof module:UTILITAIRES
 * @description verifie si l'appareil est un mobile
 * @returns {boolean} true si mobile, false sinon
 */
window.verificationMobile = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor);
    return check;
};

export { aligner, scale, rectangleInteractif, texte, animation, COULEUR_PRINCIPAL, BLEU_PRIMAIRE };