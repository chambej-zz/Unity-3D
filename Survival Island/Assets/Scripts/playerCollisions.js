#pragma strict

private var doorIsOpen : boolean = false;
private var doorTimer: float = 0.0;
private var currentDoor : GameObject;

var doorOpenTime : float = 3.0;
var doorOpenSound : AudioClip;
var doorShutSound : AudioClip;
var batteryCollect : AudioClip;

function Update () {
	if(doorIsOpen) {
		doorTimer += Time.deltaTime;
		if(doorTimer > doorOpenTime) {
			Door(doorShutSound, false, "doorshut", currentDoor);
			doorTimer = 0.0;
		}
	}
	
	// Ray Casting collider to open the outpost door
	var hit : RaycastHit;
	
	if(Physics.Raycast (transform.position, transform.forward, hit, 5)) {
		if(hit.collider.gameObject.tag == "outpostDoor" && doorIsOpen == false && BatteryCollect.charge >= 4) {
			currentDoor = hit.collider.gameObject;
			Door(doorOpenSound, true, "dooropen", currentDoor);
			GameObject.Find("Battery GUI").GetComponent(GUITexture).enabled = false;
		} else if(hit.collider.gameObject.tag == "outpostDoor" && doorIsOpen == false && BatteryCollect.charge < 4) {
			GameObject.Find("Battery GUI").GetComponent(GUITexture).enabled = true;
			TextHints.message = "The door seems to need more power..";
			TextHints.textOn = true;
			
		}
	}
}

/*
function OnControllerColliderHit(hit : ControllerColliderHit) {
	if(hit.gameObject.tag == "outpostDoor" && doorIsOpen == false){
		currentDoor = hit.gameObject;
		Door(doorOpenSound, true, "dooropen", currentDoor);
	}
}
*/

function Door(aClip : AudioClip, openCheck : boolean, animName : String, thisDoor : GameObject) {
	audio.PlayOneShot(aClip);
	doorIsOpen = openCheck;
	thisDoor.transform.parent.animation.Play(animName);
}

function OnTriggerEnter(collisionInfo : Collider) {
	if(collisionInfo.gameObject.tag == "battery") {
		BatteryCollect.charge++;
		audio.PlayOneShot(batteryCollect);
		Destroy(collisionInfo.gameObject);
	}
}
@script RequireComponent(AudioSource)
