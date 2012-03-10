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

function OnControllerColliderHit(hit : ControllerColliderHit) {
	var crosshairObj : GameObject = GameObject.Find("Crosshair");
	var crosshair : GUITexture = crosshairObj.GetComponent(GUITexture);
	if(hit.collider == GameObject.Find("mat").collider) {
		CoconutThrow.canThrow = true;
		crosshair.enabled = true;
		TextHints.textOn = true;
		TextHints.message = "Knock down all 3 targets at once to win a battery!";
		GameObject.Find("TextHint GUI").transform.position.y = 0.2;
		
	} else {
		CoconutThrow.canThrow = false;
		crosshair.enabled = false;
		TextHints.message = "";
		GameObject.Find("TextHint GUI").transform.position.y = 0.5;
	}
}

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
