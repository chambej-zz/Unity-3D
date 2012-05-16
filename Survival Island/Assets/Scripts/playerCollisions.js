#pragma strict

private var doorIsOpen : boolean = false;
private var doorTimer: float = 0.0;
private var currentDoor : GameObject;
private var haveMatches : boolean = false;

var doorOpenTime : float = 3.0;
var doorOpenSound : AudioClip;
var doorShutSound : AudioClip;
var batteryCollect : AudioClip;
var matchGUI : GameObject;

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
			TextHints.message = "The door seems to need more batteries..";
			TextHints.textOn = true;
			
		}
	}
}

function OnControllerColliderHit(hit : ControllerColliderHit) {
	if(hit.collider.gameObject == GameObject.Find("campfire")){
		if(haveMatches) {
			haveMatches = false;
			lightFire();
		} else {
			GameObject.Find("TextHint GUI").transform.position.y = 0.1;
			TextHints.message = "You will need some matches to light this camp fire..";
			TextHints.textOn = true;
		}
	}
	var crosshairObj : GameObject = GameObject.Find("Crosshair");
	var crosshair : GUITexture = crosshairObj.GetComponent(GUITexture);
	if(hit.collider == GameObject.Find("mat").collider) {
		CoconutThrow.canThrow = true;
		crosshair.enabled = true;
		TextHints.message = "Knock down all 3 targets at once to win a battery!";
		GameObject.Find("TextHint GUI").transform.position.y = 0.2;
		TextHints.textOn = true;
		
	} else {
		CoconutThrow.canThrow = false;
		crosshair.enabled = false;
		GameObject.Find("TextHint GUI").transform.position.y = 0.5;
		TextHints.message = "";
		
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
	if(collisionInfo.gameObject.name == "matchbox"){
		Destroy(collisionInfo.gameObject);
		haveMatches = true;
		audio.PlayOneShot(batteryCollect);
		var matchGUIobj = Instantiate(matchGUI, Vector3(0.15,0.1,0),transform.rotation);
		matchGUIobj.name = "matchGUI";
	}
}

function lightFire(){
	var campfire : GameObject = GameObject.Find("campfire");
	var campSound : AudioSource = campfire.GetComponent(AudioSource);
	campSound.Play();
	
	var flames : GameObject = GameObject.Find("FireSystem");
	var flameEmitter : ParticleSystem = flames.GetComponent(ParticleSystem);
	flameEmitter.Play();
	
	var smoke : GameObject = GameObject.Find("SmokeSystem");
	var smokeEmitter : ParticleSystem = smoke.GetComponent(ParticleSystem);
	smokeEmitter.Play();
	
	Destroy(GameObject.Find("matchGUI"));
	
	TextHints.message = "You lit the Fire, you will survive the night. Well done!";	
	TextHints.textOn = true;

	yield new WaitForSeconds(5);
	Application.LoadLevel("Menu");
	
}
@script RequireComponent(AudioSource)
