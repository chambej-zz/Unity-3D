#pragma strict

static var charge : int = 0;
var charge1tex : Texture2D;
var charge2tex : Texture2D;
var charge3tex : Texture2D;
var charge4tex : Texture2D;
var charge0tex : Texture2D;

function Start () {
	guiTexture.enabled = false;
	charge = 0;
}

function Update () {
	if(charge == 1) {
		guiTexture.texture = charge1tex;
		guiTexture.enabled = true;
	} else if(charge == 2){
		guiTexture.texture = charge2tex;
	} else if(charge == 3) {
		guiTexture.texture = charge3tex;
	} else if(charge >= 4) {
		guiTexture.texture = charge4tex;
	} else {
		guiTexture.texture = charge0tex;
	}
}