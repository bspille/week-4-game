//vars and functions go here
game = {
	field: $("#mapArea"),

	locked: false,

	zones: ["selection", "enemy", "combat", "graveyard"],

	characters: ["char_1", "char_2", "char_3", "char_4"],
	enemy: [],

	charaImage: [],

	buttons: ["start", "attack"],

	player: [],



	HP: ["100", "110", "120", "130"],
	hStat: [],

	atk: ["6", "8", "10", "12"],
	aStat: [],

	cntrAtk: ["7", "9", "11", "13"],
	cStat: [],
// sets the stage to begining values can be used to reload the game without reloading the page
	load: 	function() {
				var newBtn = $("<button>" + game.buttons[0] + "</button>");
				newBtn.attr("id", "startBtn");
				game.field.append(newBtn);
				for (var i = 0; i < game.characters.length; i++) {
					game.enemy.push(game.characters[i]);
				};
				for (var i = 0; i < game.HP.length; i++) {
					game.hStat.push(game.HP[i]);
				};
				for (var i = 0; i < game.atk.length; i++) {
					game.aStat.push(game.atk[i]);
				}
				for (var i = 0; i < game.cntrAtk.length; i++) {
					game.cStat.push(game.cntrAtk[i]);
				}
				game.start();
			
			},
// start button function that creates the character selection
	start: 	function() {
				$("#startBtn").on("click", function() {
					game.field.empty();
					var newDiv = $("<div>");
					newDiv.attr("id", game.zones[0]);
					for (var i = 0; i < game.characters.length; i++) {
						var newBtn = $("<button>");
						var newImg = $("<img>");
						newImg.attr("class", "chara");
						newImg.attr("alt", game.characters[i]);
						// newImg.attr("src", "asset/images/" + game.charaImage[i]);
						newBtn.append(newImg);
						newBtn.attr("class", "selBtn");
						newBtn.val(game.characters[i]);
						newDiv.append(newBtn);				
					};							
					game.field.append(newDiv);
					game.setparty();

				});
				// game.setparty();
			},
// selection button function that stores selection results
	setparty: 	function() {				
					$(".selBtn").on("click", function() {
						game.player	= ($(this).val());
						var n = game.enemy.indexOf(game.player);
						game.enemy.splice(n,1);							
						game.genmap();
					});
				},
// creates the divs that act at the key zones in the game
	genmap: function() {
				game.field.empty();
				for (var i = 0; i < game.zones.length; i++) {
					var newDiv = $("<div>");
					
					newDiv.attr("id", game.zones[i]);
					newDiv.attr("class", "quadrant");
					game.field.append(newDiv);
				};
				game.fieldplyr();
			},
// sets the player in selection zone on the field
	fieldplyr: 	function() {
					var newDiv = $("<div>");
					var newImg = $("<img>");
					
					newImg.attr("alt", game.player);
					newImg.attr("id", game.characters.indexOf(game.player));
					
					newDiv.append(newImg);
					newDiv.attr("role","player");
					newDiv.attr("id", game.player);
					$("#selection").append(newDiv);

					game.fieldenemy();									
				},
// sets the enemies in the enemy zone for selection
	fieldenemy: function() {

					for (i = 0; i < game.enemy.length; i++) {
						var newBtn = $("<button>");
						var newImg = $("<img>");

						newImg.attr("alt", game.enemy[i]);
						newImg.attr("id", "image_" + game.characters.indexOf(game.enemy[i]));
						
						newBtn.append(newImg);
						newBtn.addClass("avatar enemyParty");
						newBtn.attr("id", game.enemy[i]);
						
						$("#enemy").append(newBtn);
					}
					game.genStats();
				},
// applies randomly selected stats from the stat array's with no repeats and writes initial values
	genStats: 	function() {

					for (var i = 0; i < game.characters.length; i++) {
						var apply = $("#" + game.characters[i]);
						
						var hpl = game.hStat.length - 1;
						var rh = (Math.round(Math.random() * hpl));
						apply.attr("HP", game.hStat[rh]);
						apply.append("<p class='displayhp'>" + "HP " + game.hStat[rh] + "</p>");
						game.hStat.splice(rh,1);

						
						var atkl = game.aStat.length - 1;						
						var ra = (Math.round(Math.random() * atkl));
						apply.attr("Atk", game.aStat[ra]);
						apply.append("<p class='displayatk'>" + "ATK " + game.aStat[ra] + "</p>");
						game.aStat.splice(ra,1);

				
						var cntrAtkl = game.cStat.length - 1;						
						var rc = (Math.round(Math.random() * cntrAtkl));
						apply.attr("cntrAtk", game.cStat[rc]);
						apply.append("<p class='displaycntr'>" + "CNTR " + game.cStat[rc] + "</p>");
						game.cStat.splice(rc,1);

					}
				
					game.cloneIn();
				},
// moves the selcted enemy to the combat zone and triggers locked
	cloneIn: 	function() {
					
					$(".enemyParty").on("click", function() {
						var opon = ($(this).attr("id"));
						if (!game.locked) {
							$("[role=defender]").attr("role", "defeated");
							$(this).attr("role","defender");
							$(this).clone().appendTo("#combat");
							$("#enemy").children('#' + opon).remove();
							game.locked = true;
							game.combat();
						};

					});
				},
// generates a attack button and performs the combat actions
	combat: 	function() {
					var newBtn = $("<button>");
					newBtn.text("Attack");
					newBtn.addClass("attack");
					$("#selection").append(newBtn);
					var baseAtk = parseInt($("[role=player]").attr("atk"));
					var pBaseAtk = parseInt($("[role=player]").attr("atk"));
					// pDamage.push();
					var pHealth = parseInt($("[role=player]").attr("hp"));
					// pHealth.push();
					var eCounter = parseInt($("[role=defender]").attr("cntratk"));
					// eDamage.push();
					var eHealth = parseInt($("[role=defender").attr("hp"));
					// eHealth.push();
					$(".attack").on("click", function() {
						eHealth = eHealth - pBaseAtk;
						$("[role=defender]").attr("hp", eHealth);
						pBaseAtk = pBaseAtk + baseAtk;
						$("[role=player]").attr("atk", pBaseAtk);
						pHealth = pHealth - eCounter;
						$("[role=player]").attr("hp", pHealth);
						game.rewrite();
					});
				},
// rewrites the stats that change
	rewrite: 	function() {
				var defender = $("[role=defender]");
				var player = $("[role=player");
				var dhStat = defender.attr("hp");
				defender.children(".displayhp").text("HP " + dhStat);
				var paStat = player.attr("atk");
				player.children(".displyatk").text("ATK " + paStat);
				var phStat = player.attr("hp");
				player.children(".displayhp").text("HP " + phStat);
				game.defeated(defender, phStat, dhStat);
			},

	defeated: 	function(defender, phStat, dhStat) {
					if (dhStat <= 0) {
						defender.clone().appendTo("#graveyard");
						// defender.attr("role", "defeated");
						$("#selection").children(".attack").remove();
						$("#combat").empty();
						game.locked = false;
					};
	}


	//set conditions
	// enemies are move to grave yard when killed and enemy selction unlocks
	// win condition defeat all or lose
	// display images
}

// event functions go here
$(document).ready(function() {

	game.load();
});