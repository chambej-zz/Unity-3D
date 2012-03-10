#pragma strict
var targetRoot : GameObject;
private var beenHit : boolean = false;
private var timer : float = 0.0;
var hitSound : AudioClip;
var resetSound : AudioClip;

function Start () {

}

function OnCollisionEnter(theObject : Collision) {
	if(beenHit == false && theObject.gameObject.name == "coconut") {
		audio.PlayOneShot(hitSound);
		targetRoot.animation.Play("down");
		beenHit = true;
		CoconutWin.targets++;
	}
}
function Update () {
	if(beenHit) {
		timer += Time.deltaTime;
	}
	if(timer > 3) {
		audio.PlayOneShot(resetSound);
		targetRoot.animation.Play("up");
		beenHit = false;
		CoconutWin.targets--;
		timer = 0.0;
	}
}

@script RequireComponent(AudioSource)