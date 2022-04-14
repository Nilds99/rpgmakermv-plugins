//=============================================================================
// LevelDrain.js
// v1.0 Release
// v1.1 Bugfixes, added stats-display, added plugin command "showenemystats [Enemy]"
// v1.2 Improved drain messages, added status drain mechanic, minor code improvements
// v2.0 Added gauges / Windows to replace old messages; customizeable Sound Effects
//=============================================================================
/*:
 * @plugindesc v1.1 Level and experience drain for enemies and actors.
 * @author Slinds
 *
 * @param Display Enemy Gauge
 * @desc 1 = show, 0 = don't show                          
 * @default 1
 *
 * @param Enemy Gauge x
 * @desc X coordinate of the Enemy Gauge                        
 * @default 0
 *
 * @param Enemy Gauge y
 * @desc Y coordinate of the Enemy Gauge                        
 * @default 0
 *
 * @param
 *
 * @param Display Player Gauge
 * @desc 1 = show, 0 = don't show                          
 * @default 1
 *
 * @param Player Gauge x
 * @desc X coordinate of the Enemy Gauge                        
 * @default 476
 *
 * @param Player Gauge y
 * @desc Y coordinate of the Enemy Gauge                        
 * @default 336
 *
 * @param
 *
 * @param Show Messages
 * @desc 1 = show, 0 = don't show                          
 * @default 0
 *
 * @param Level Reduced Message
 * @desc %1 = name, %2 = level change, %3 = new level, %4 = old Level
 * @default The Level of %1 decreased by %2
 *
 * @param Exp Reduced Message
 * @desc %1 = subject name, %2 exp change
 * @default %1 got %2 Exp drained
 *
 * @param Level Increased Message
 * @desc %1 = name, %2 = level change, %3 = new level, %4 = old Level
 * @default %1 went up to Level %3!
 *
 * @param
 *
 * @param Enable Exp Drain Sounds
 * @desc 1 = turn on, 0 = turn of                  
 * @default 1
 *
 * @param Exp Up Se
 * @desc Name of the soundeffect in the games audio/se folder 
 * Default: Recovery 
 * @default Recovery
 *
 * @param Exp Down Se
 * @desc Name of the soundeffect in the games audio/se folder  
 * Default: Poison 
 * @default Poison
 *
 * @param
 *
 * @param Class
 * @desc Set the class for the exp curve. default: 1 (first class)                           
 * @default 1
 *
 * @help
 * =============================================================================
 * Plugin Features:
 * =============================================================================
 *
 * 1. Customizable start level and experience for enemies.
 *    You can Customize the experience curve and the attribute gain per 
 *    level up for every single enemy.
 *
 * 2. Level drain and exp drain for enemies and actors in battles and events.
 *    It can be performed in battle via skill and in events via plugin command.
 *
 * 3. Customizable Messages for Level drain.
 *
 * 4. Multiple Plugincommands for controlling and reading important statistics. 
 *
 * 5. Status drain mechanic for enemies and actors.
 *
 * =============================================================================
 * Step 1 - Enemies Notetags
 * =============================================================================
 *
 *  After you turned on the plugin in the plugin manager, you have to put the 
 *  following metadata inside an enemy note tag for the plugin to work. The 
 *  minimum requirement is the <level:x> tag, which most of the functions work.
 *
 *  Example: <level:5> → the enemy will start at level 5
 *
 *  <level:x>	
 *  defines the initial level for an enemy and enables level drain.
 *	
 *  <mhp:x>	
 *  defines the additional maxHp for every level up.
 *
 *  <mmp:x>	
 *  defines the additional maxMp for every level up.
 *
 *  <atk:x>	
 *  defines the additional attack for every level up.
 *
 *  <def:x>	 
 *  defines the additional defense for every level up.
 *
 *  <mat:x>	
 *  defines the additional magick for every level up.
 *
 *  <mdf:x>	
 *  defines the additional magick for every level up.
 *
 *  <agi:x>	 
 *  defines the additional agility for every level up.
 *
 *  <lck:x>	
 *  defines the additional for every level up.
 *
 * =============================================================================
 * Step 2.1 - Skills Notetags:
 * =============================================================================
 * 
 *  If you wish a level drain or exp drain skill, you can put the following 
 *  tags inside the skills note tag
 * 
 *  <leveldrain:x>	
 *  replace x with the amount of level to drain
 *
 *  <expdrain:x>	
 *  replace x with the amount of exp to drain
 *
 * =============================================================================
 * Step 2.2 - For events:
 * =============================================================================
 * 
 *  Actors and enemies can use leveldrain and exp drain outside of battles.
 *  Simply choose on the eventpage "Plugin Command" and type the following
 *  commands. Please do not use the square brackets -> []
 *  Note: If you put in a negative amount, the enemy gets drained by the actor.
 *
 *  Example1: leveldrain 7 1 1    → the Enemy with the id 7 
 *                                   drains 1 level from actor 1.
 *
 *  Example2: leveldrain 7 -1 1   → the Enemy with the id 7 gets
 *                                   1 level drained by actor 1.
 *
 *  Example3: expdrain 7 550 1    → the Enemy with the id 7
 *                                   drains 550 Exp from actor 1.
 *
 *  Example4: expdrain 7 -550 1   → the Enemy with the id 7 gets
 *                                   550 Exp drained by actor 1.
 *
 * =============================================================================
 * List of all Plugin Commands (do not use the square brackets [])
 * =============================================================================
 *
 * leveldrain [Enemy ID] [Amount] [Actor ID] 
 * -> level drain between enemy and actor.
 *    Note: If you put in a negative amount, the enemy gets drained by the actor.
 *
 * expdrain [Enemy ID] [Amount] [Actor ID]
 * -> level drain between enemy and actor.
 *    Note: If you put in a negative amount, the enemy gets drained by the actor.
 * 
 * statusdrain [Enemy ID] [status] [Amount] [Actor ID]
 * -> status drain between enemy and actors.
 *    Note1: If you put in a negative amount, the enemy gets drained by the actor.
 *    Note2: statuses: mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * actorleveldrain [Actor ID] [Amount] [Target Actor ID]
 * -> level drain between two actors.
 *
 * actorstatusdrain [Actor ID] [status] [Amount] [Target Actor ID]
 * -> status drain between two actors.
 *    Note: statuses: mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * actorexpdrain [Actor ID] [Amount] [Target Actor ID]
 * -> exp drain between two actors.
 *
 * resetleveldrain [Enemy ID]							
 * -> replace [Enemy] with the enemy Id to reset the level to the start values.
 *    Note: you can also use "resetleveldrain all" to reset all.
 * 
 * refundleveldrain	
 * -> sets all enemies level to the start values and gives actors all lost 
 *    exp and level back. 
 * 
 * getactorslostlevel [Actor ID] [game variable]
 * -> writes the lost level of an specific actor into an game variable
 *
 * getactorslostexp [Actor ID] [game variable]
 * -> writes the lost exp of an specific actor into an game variable
 * 
 * getenemylevel [Enemy ID] [game variable]			
 * -> writes the level of the specified enemy into an game variable
 * 
 * getenemyexp [Enemy ID] [game variable]
 * -> writes the exp of the specified enemy into an game variable
 *
 * getenemydrainedlevel [Enemy ID] [game variable]
 * -> writes the drained level of the enemy into an game variable
 *
 * getenemydrainedexp [Enemy ID] [game variable]
 * -> writes the drained exp of the enemy into an game variable
 * 
*/

/*:ja
 * @plugindesc v1.1敵やアクターのレベルや経験値ドレイン
 * @author Slinds
 *
 * @param Show Messages
 * @desc 1 = 点ける, 0 = 止める                        
 * @default 0
 *
 * @param Level Reduced Message
 * @desc %1 = 名前, %2 = ロストレベル, %3 = ニューレベル, %4 = 前のレベル
 * @default %1のレベルが %2 下がった
 *
 * @param Exp Reduced Message
 * @desc %1 = 名前, %2 ロストExp
 * @default %1は %2 Expを失った 
 *
 * @param Level Increased Message
 * @desc %1 = 名前, %2 = 累積レベル, %3 = ニューレベル, %4 = 前のレベル
 * @default %1はレベル %3 に上がった
 *
 * @param
 *
 * @param Display Enemy Gauge
 * @desc 1 = 点ける, 0 = 止める                         
 * @default 1
 *
 * @param Enemy Gauge x
 * @desc エネミーゲージのX座標 
 * デフォルト： 0 
 * @default 0
 *
 * @param Enemy Gauge y
 * @desc エネミーゲージのY座標 
 * デフォルト： 0 
 * @default 0
 *
 * @param
 *
 * @param Display Player Gauge
 * @desc 1 = 点ける, 0 = 止める                         
 * @default 1
 *
 * @param Player Gauge x
 * @desc プレイヤーゲージのX座標  
 * デフォルト： 476  
 * @default 476
 *
 * @param Player Gauge y
 * @desc プレイヤーゲージのY座標
 * デフォルト： 336 
 * @default 336
 *
 * @param
 *
 * @param Enable Exp Drain Sounds
 * @desc 1 = 点ける, 0 = 止める                  
 * @default 1
 *
 * @param Exp Up Se
 * @desc ゲームファイルの ¥www¥audio¥se フォルダにある効果音の名前
 * デフォルト： Recovery 
 * @default Recovery
 *
 * @param Exp Down Se
 * @desc ゲームファイルの ¥www¥audio¥se フォルダにある効果音の名前  
 * デフォルト： Poison 
 * @default Poison
 *
 * @param
 *
 * @param Class
 * @desc 敵のExpカーブのクラスを設定 
 * デフォルト：1                          
 * @default 1
 *
 * @help
 * この記述は機械翻訳です。
 *
 * =============================================================================
 * プラグインの特徴
 * =============================================================================
 *
 * 1. 敵の開始レベルや経験値をカスタマイズ可能。
 *    経験値カーブと属性獲得量をカスタマイズできます。
 *    敵ごとにレベルアップ。
 *
 * 2. バトルやイベントでの敵やアクターのレベルドレイン、Expドレイン。
 *    バトルではスキルで、イベントではプラグインコマンドで実行可能です。
 *
 * 3. レベルドレインのメッセージのカスタマイズが可能です。
 *
 * 4. 重要な統計情報を制御し、読み取るための複数のプラグインコマンド。
 *
 * 5. 敵やアクターのステータス・ドレインメカニック。
 *
 * =============================================================================
 * ステップ1 - 敵のノートタグ
 * =============================================================================
 *
 *  プラグインマネージャーでプラグインをオンにした後、以下のメタデータを
 *  敵ノートタグ内に記述することでプラグインが動作するようになります。
 *  最低限必要なのは<level:x>タグで、ほとんどの機能が動作します。
 *
 *  例 <レベル:5> → 敵のレベルが5からになる
 *
 *  <level:x>	
 *  は、敵の初期レベルを定義し、レベルドレインを可能にします。
 *	
 *  <mhp:x>	
 *  は、敵のレベルが上がるごとに追加される最大HPを定義します。
 *
 *  <mmp:x>	
 *  は、敵のレベルが上がるごとに追加される最大MPを定義します。
 *
 *  <atk:x>	-
 *  は、敵のレベルが上がるごとに追加される攻撃力を定義しています。
 *
 *  <def:x>	 
 *  は、敵がレベルアップするごとに追加される防御力を定義します。
 *
 *  <mat:x>	
 *  は、敵のレベルが上がるごとに追加される魔法攻撃を定義しています。
 *
 *  <mdf:x>	
 *  は、敵のレベルが上がるごとに追加される魔法防御力を定義しています。
 *
 *  <agi:x>	 
 *  は、敵のレベルが上がるごとに敏捷性が追加されることを定義しています。
 *
 *  <lck:x>	
 *  は、敵のレベルが上がるごとに追加される運を定義しています。
 *
 * =============================================================================
 * ステップ2.1 - スキルノート:
 * =============================================================================
 * 
 *  レベルドレインやExpドレインのスキルを希望する場合は、以下のように記述します。
 *  スキルノート・タグの中にあるタグ
 * 
 *  <leveldrain:x>	
 *  xはドレインするレベルの量に置き換えてください。
 *
 *  <expdrain:x>	
 *  xをドレインするExpの量に置き換える。
 *
 * =============================================================================
 * ステップ2.2 - イベントページにて。
 * =============================================================================
 *  アクターと敵は、戦闘中以外でもレベルドレインとエクスピードレインを使用する
 *  ことができます。イベントページで「プラグインコマンド」を選択し、以下のコマンドを
 *  入力するだけです。角括弧は使用しないでください→[]。
 *  注：マイナス分を入れると、敵は役者にドレインされます。
 *
 * 例1： leveldrain 7 1 1   → idが7のエネミーは、アクター1から
 *                           1レベルをドレインします。
 *
 * 例2： leveldrain 7 -1 1  → id7の敵は役者1から1レベル消耗される。
 *
 * 例3： expdrain 7 550 1   → id7の敵は、アクター1から550Expを消耗します。
 *
 * 例4： expdrain 7 -550 1  → id7のエネミーはアクター1から550Expを消耗されます。
 *
 * =============================================================================
 * プラグインコマンド一覧（[]は使用しないでください。）
 * =============================================================================
 *
 * leveldrain [エネミーID] [量] [アクターID] 
 * -> 敵と俳優の間のレベルドレイン。
 *    注：マイナス分を入れると、敵は役者にドレインされます。
 *
 * expdrain [エネミーID] [量] [アクターID]
 * -> 敵と俳優の間の経験のドレイン。
 *    注：マイナス分を入れると、敵は役者にドレインされます。
 * 
 * actorleveldrain [アクターID] [量] [ターゲットアクターID]
 * -> 二人のアクター間のレベルドレイン。
 * 
 * actorexpdrain [アクターID] [量] [ターゲットアクターID]
 * -> 二人のアクター間のエクスペリエンスドレイン。
 *
 * statusdrain [エネミーID] [ステータス] [量] [アクターID]。
 * -> 敵とアクター間のステータス・ドレイン。
 * 注1：マイナスの金額を入れると、敵はアクターからドレインされる。
 * 注2：ステータス： mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * actorstatusdrain [アクターID] [ステータス] [量] [ターゲットアクターID]。
 * -> 2つのアクター間でステータスのドレインを行う。
 * 注：ステータス： mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * resetleveldrain [エネミーID]							
 * -> 敵のレベルを開始値にリセットします。
 *    注：resetleveldrain allを使うと、すべての敵をリセットすることもできます。
 * 
 * refundleveldrain	
 * -> 全ての敵のレベルを初期値に設定し、全てのアクターに失われたExpとレベルを戻します。
 * 
 * getactorslostlevel [アクターID] [ゲーム変数]
 * -> 特定のアクターのロストレベルを指定したゲーム変数に書き込みます。
 *
 * getactorslostexp [アクターID] [ゲーム変数]
 * -> 特定のアクターの失われたExpを、特定のゲーム変数に書き込みます。
 * 
 * getenemylevel [エネミーID] [ゲーム変数]			
 * -> 指定された敵のレベルを特定のゲーム変数に書き込む。
 * 
 * getenemyexp [エネミーID] [ゲーム変数]
 * -> 指定した敵の経験値を特定のゲーム変数に書き込む。
 *
 * getenemydrainedlevel [エネミーID] [ゲーム変数]
 * -> 収集した敵のレベルを特定のゲーム変数に書き込みます。
 *
 * getenemydrainedexp [エネミーID] [ゲーム変数]
 * -> 収集した敵のExpを特定のゲーム変数に書き込みます。
 * 
 */
//-----------------------------------------------------------------------------
// variables
//-----------------------------------------------------------------------------
var slinds = slinds || {};
slinds.parameters = PluginManager.parameters('LevelDrain');
slinds.enemyClass = Number(slinds.parameters['Class']);
slinds.showDrainMessages = slinds.parameters['Show Messages'];
slinds.expReducedMessage = slinds.parameters['Exp Reduced Message'];
slinds.lvlReducedMessage = slinds.parameters['Level Reduced Message'];
slinds.lvlIncreasedMessage = slinds.parameters['Level Increased Message'];

slinds.showEnemyGauge = slinds.parameters['Display Enemy Gauge'];
slinds.enemyStatsX = parseInt(slinds.parameters['Enemy Gauge x']);
slinds.enemyStatsY = parseInt(slinds.parameters['Enemy Gauge y']);
slinds.showActorGauge = slinds.parameters['Display Player Gauge'];
slinds.actorStatsX = parseInt(slinds.parameters['Player Gauge x']);
slinds.actorStatsY = parseInt(slinds.parameters['Player Gauge y']);

slinds.playSounds = slinds.parameters['Enable Exp Drain Sounds'];
slinds.expUpSound = slinds.parameters['Exp Up Se'];;
slinds.expDownSound = slinds.parameters['Exp Down Se'];;


slinds.$leveledEnemies = null;
slinds.$drainEnemy = null;
slinds.$drainActor = null;

//-----------------------------------------------------------------------------
// Custom Queue Object
//-----------------------------------------------------------------------------

function customQueue() {
	this.initialize.apply(this, arguments);
}

customQueue.prototype.initialize = function() {
	this.elements = [];
    this.head = 0;
    this.tail = 0;
};

customQueue.prototype.enqueue = function(element) {
	this.elements[this.tail] = element;
	this.tail++;
};

customQueue.prototype.dequeue = function() {
	const item = this.peek();
	delete this.elements[this.head];
	this.head++;
	return item;
};

customQueue.prototype.peek = function() {
	return this.elements[this.head];
};

customQueue.prototype.length = function() {
	return this.tail - this.head;
};

//-----------------------------------------------------------------------------
// Leveled_Enemies as wrapper class for Leveled_Enemy 
//-----------------------------------------------------------------------------

function Leveled_Enemies() {
	this.initialize.apply(this, arguments);
};

Leveled_Enemies.prototype.initialize = function() {
	this._data = [];
};

//-----------------------------------------------------------------------------
// Leveled_Enemy to store the Level of Enemy
//-----------------------------------------------------------------------------

function Leveled_Enemy() {
	this.initialize.apply(this, arguments);
};

Leveled_Enemy.prototype = Object.create(Game_Battler.prototype);
Leveled_Enemy.prototype.constructor = Leveled_Enemy;

Leveled_Enemy.prototype.initialize = function(enemyId) {
	Game_Battler.prototype.initialize.call(this)
	this.enemyId = enemyId;
	this._name = '';
	this.startLevel = 0;
	this.level = 0;
	this._exp = 0;
	this.classId = 1;
	this.refreshEnemy();
	this.statDrain = false;
};

Leveled_Enemy.prototype.name = function(){
	return this._name;
};

Leveled_Enemy.prototype.refreshEnemy = function () {
	var enemy = $dataEnemies[this.enemyId];
	this._name = enemy.name;
	this.classId = slinds.enemyClass;
	if (enemy.meta.level){	
		if(parseInt(enemy.meta.level) != this.startLevel){
			this.startLevel = parseInt(enemy.meta.level);
			var exp = this.expForLevel(this.startLevel) + this.expStolen - this.expLost;
			this.changeExp(exp);
		}
	}
	else{
		this.level = 0;
	}
};

Leveled_Enemy.prototype.currentClass = function() {
    return $dataClasses[slinds.enemyClass];
};

Leveled_Enemy.prototype.expForLevel = function(level) {
    var c = this.currentClass();
    var basis = c.expParams[0];
    var extra = c.expParams[1];
    var acc_a = c.expParams[2];
    var acc_b = c.expParams[3];
    return Math.round(basis*(Math.pow(level-1, 0.9+acc_a/250))*level*
            (level+1)/(6+Math.pow(level,2)/50/acc_b)+(level-1)*extra);
};

Leveled_Enemy.prototype.changeExp = function(exp, show) {
    this._exp = exp;
    while (this._exp >= this.nextLevelExp()) {
        this.levelUp();
    }
    while (this._exp < this.expForLevel(this.level)) {
        this.levelDown();
    }
};

Leveled_Enemy.prototype.levelUp = function() {
    this.level++;
};

Leveled_Enemy.prototype.levelDown = function() {
    this.level--;
};

Leveled_Enemy.prototype.nextLevelExp = function() {
	return this.expForLevel(this.level + 1);
};

Leveled_Enemy.prototype.nextRequiredExp = function() {
	return this.nextLevelExp() - this._exp;
};

Leveled_Enemy.prototype.levelAlteration = function () {
	return this.level - this.startLevel;
};

Leveled_Enemy.prototype.currentExp = function() {
	return this._exp;
};

Leveled_Enemy.prototype.changeLevel = function(level, show) {;
    this.changeExp(this.expForLevel(level));
};

Leveled_Enemy.prototype.enemy = function() {
    return $dataEnemies[this.enemyId];
};

Leveled_Enemy.prototype.paramCorrection = function(){
	if (this.hppercentage != 0) {
		if($gameParty.inBattle()){
			for(var i = 0; $gameTroop._enemies.length > i; i++) {
				if ($gameTroop._enemies[i].id = this.enemyId)
				{
					$gameTroop._enemies[i].setHp(Math.round(this.mhp * this.hppercentage));
					$gameTroop._enemies[i].setMp(Math.round(this.mmp * this.mppercentage));	
				}
			}
		}
	}
};

Leveled_Enemy.prototype.setParamPercentage = function(){
	var doubleckeck = 0;
	if($gameParty.inBattle()){
		for(var i = 0; $gameTroop._enemies.length > i; i++) {
			if (doubleckeck == 0){
				if ($gameTroop._enemies[i].id = this.enemyId)
				{
					var doubleckeck = 1;
					var enemy = $gameTroop._enemies[i];
					this.hppercentage = enemy.hp / enemy.mhp;
					this.mppercentage = enemy.mp / enemy.mmp;
				}
			}
			else {
				this.hppercentage = 0;
			}
		}
	}

};

Leveled_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

Leveled_Enemy.prototype.paramLevelDrain = function(paramId) {
	return this.translateMeta(paramId) * this.levelAlteration() + this.drainParam[paramId];
};

Leveled_Enemy.prototype.translateMeta = function(paramId){
	switch(paramId){
		case 0:
			if(this.enemy().meta.mhp){
				return parseInt(this.enemy().meta.mhp);
			}
			break;
		case 1:
			if(this.enemy().meta.mmp){	
				return parseInt(this.enemy().meta.mmp);
			}
			break;
		case 2:
			if(this.enemy().meta.atk){
				return parseInt(this.enemy().meta.atk);
			}
			break;
		case 3:
			if(this.enemy().meta.def){
				return parseInt(this.enemy().meta.def);
			}
			break;
		case 4:
			if(this.enemy().meta.mat){
				return parseInt(this.enemy().meta.mat);
			}
			break;
		case 5:
			if(this.enemy().meta.mdf){
				return parseInt(this.enemy().meta.mdf);	
			}
			break;
		case 6:
			if(this.enemy().meta.agi){
				return parseInt(this.enemy().meta.agi);
			}
			break;
		case 7:
			if(this.enemy().meta.lck){
				return parseInt(this.enemy().meta.lck);			
			}	
			break;
		default:
			
	}
	return 0;
};

Leveled_Enemy.prototype.param = function(paramId) {
    var value = this.paramBase(paramId) + this.paramLevelDrain(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

//=============================================================================
//
// rpg_Scenes
//
//=============================================================================

//-----------------------------------------------------------------------------
// Scene_Battle
//-----------------------------------------------------------------------------

var Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
Scene_Battle.prototype.createAllWindows = function() {
	Scene_Battle_createAllWindows.call(this);
	this.createEnemyDrainGauge();	
	this.createPlayerDrainGauge();
};

Scene_Battle.prototype.createEnemyDrainGauge = function() {
	if (slinds.showEnemyGauge == 1){
		this._drainMessageWindow = new Window_DrainMessage();
		this.addWindow(this._drainMessageWindow);
	}
};

Scene_Battle.prototype.createPlayerDrainGauge = function() {
	if (slinds.showActorGauge == 1){
		this._drainMessageWindowPlayer = new Window_DrainMessagePlayer();
		this.addWindow(this._drainMessageWindowPlayer);	
	}

}; 

//-----------------------------------------------------------------------------
// Scene_Map
//-----------------------------------------------------------------------------

var Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
	Scene_Map_createAllWindows.call(this);
	this.createEnemyDrainGauge();
	this.createPlayerDrainGauge();
	
};

Scene_Map.prototype.createEnemyDrainGauge = function() {
	if (slinds.showEnemyGauge == 1){
		this._drainMessageWindow = new Window_DrainMessage();
		this.addWindow(this._drainMessageWindow);
	}
};

Scene_Map.prototype.createPlayerDrainGauge = function() {
	if (slinds.showActorGauge == 1){
		this._drainMessageWindowPlayer = new Window_DrainMessagePlayer();
		this.addWindow(this._drainMessageWindowPlayer);	
	}
}; 

//=============================================================================
//
// rpg_windows
//
//=============================================================================

//-----------------------------------------------------------------------------
// Window_Base
//-----------------------------------------------------------------------------

Window_Base.prototype.expColor = function() {
    return this.normalColor();
};
Window_Base.prototype.expGaugeColor1 = function() {
    return this.textColor(30);
};
Window_Base.prototype.expGaugeColor2 = function() {
    return this.textColor(27);
};

//-----------------------------------------------------------------------------
// Window_DrainMessage
//-----------------------------------------------------------------------------

function Window_DrainMessage() {
    this.initialize.apply(this, arguments);
}

Window_DrainMessage.prototype = Object.create(Window_Command.prototype);
Window_DrainMessage.prototype.constructor = Window_DrainMessage;

Window_DrainMessage.prototype.initialize = function() {
    var width = 340;
    var height = 108;	
    var x = slinds.enemyStatsX;
	var y = slinds.enemyStatsY;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.openness = 0;
    this.initMembers();

};

Window_DrainMessage.prototype.initMembers = function() {
	this.battler = null;
    this._waitCount = 0;
	this.setup();
};

Window_DrainMessage.prototype.setup = function(){
	this._accumulatedExp = 0;
	this._accumulatedLvl = 0;
	this._precachedExp = 0;
	this._precachedLvl = 0;
	this._reductionSpeed = 0;
	this._delay = 0;
	this._lvlUpWait = 0;

};

Window_DrainMessage.prototype.readDrainAmount = function(){
	this._accumulatedExp += this._precachedExp;
	this._accumulatedLvl += this._precachedLvl;
	this.createExpDrainPopup(this._precachedExp);		
	this._reductionSpeed = this.calculateSpeed();
	this._precachedExp = 0;
	this._precachedLvl = 0;
	
};	
	
Window_DrainMessage.prototype.calculateSpeed = function(){
	let mul = 1;
	if(this._accumulatedExp < 0){
		mul = -1;
	}
	let value = Math.ceil(this._accumulatedExp * mul /240);
	return value * mul;
};		

Window_DrainMessage.prototype.startWait = function(count) {
    this._waitCount = count;
};

Window_DrainMessage.prototype.updateWait = function() {
    if (this._waitCount > 0) {
        this._waitCount--;
        return true;
    } else {
        return false;
    }
};

Window_DrainMessage.prototype.update = function() {
	Window_Base.prototype.update.call(this);	
	if(this.detectBattler()){
		this.readAndVisualizeValues();
	}
	if(this.isOpen()){
		this.refresh(); 
	}
};

Window_DrainMessage.prototype.detectBattler = function(){
	if(slinds.$drainEnemy){
		if (this.battler != slinds.$drainEnemy){
			this.battler = slinds.$drainEnemy;
			this.setup();
		}
		return true;		
	} else {
		return false;
	}
};

Window_DrainMessage.prototype.precacheValues = function(){
	this._precachedExp += this.battler.expGain;
	this._precachedLvl += this.battler.lvlGain;
	this.battler.expGain = 0;
	this.battler.lvlGain = 0;
	this.startWait(480);
};

Window_DrainMessage.prototype.readAndVisualizeValues = function(){
	if(this.battler.expGain != 0 ||this._precachedExp != 0) {
		if(this._precachedExp == 0 && this.battler.expGain > 0 && this._delay == 0){
			this._delay = 45;
		}
		this.precacheValues();
		this.open();
		this.drawDrainGauge();
		if(!this.updateDelay()){
			this.readDrainAmount();
		}
	}
};

Window_DrainMessage.prototype.updateDelay = function(){
	if(this._delay > 0){
		this._delay --;
		return true;
	} else {
		return false;
	}
};

Window_DrainMessage.prototype.refresh = function() {
	if (this.doesContinue()) {
		this.contents.clear();
		this.updateGauges();
		this.drawDrainGauge();
	}
	else if (!this.updateWait()){
		this.close();
	}
};

Window_DrainMessage.prototype.updateGauges = function(){
	if(!this.isLvlUpWait()){
		this.updateExpGauge();
	}
	this.updateLevelGauge();
};

Window_DrainMessage.prototype.updateExpGauge = function() {
	if (this._accumulatedExp == 0){
		this._reductionSpeed = 0;
	}
	if (this._reductionSpeed != 0){
		this._accumulatedExp -= this.refreshReductionSpeed();		
	}
};

Window_DrainMessage.prototype.refreshReductionSpeed = function(){
	var mul = 1;
	if(this._reductionSpeed < 0) {
		var mul = -1;
	}
	if (this._accumulatedExp * mul < this._reductionSpeed * 10 * mul){
		if (this._accumulatedExp * mul <= this._reductionSpeed * mul) {
			this._reductionSpeed = 1 * mul;
		}
		else {
			this._reductionSpeed -= Math.floor(this._reductionSpeed * mul/ 10)* mul;
		}
	}
	return this._reductionSpeed;
};

Window_DrainMessage.prototype.updateLevelGauge = function() {
	if (this.expToDisplay() >= this.expToDisplayNext()) {
		this.createLvlDrainPopup(this.width / 5, this.lineHeight() / 2 * 3, this.battler.level - this.levelToDisplay());
		this._accumulatedExp += this.expToDisplay() - this.expToDisplayNext();
		this._accumulatedLvl --;
		this._lvlUpWait = 4;
	}
	if (this.expToDisplay() < 0) {
		this._accumulatedLvl ++;
		this._lvlUpWait = 4;
		this.createLvlDrainPopup(this.width / 5, this.lineHeight() / 2 * 3, this.battler.level - this.levelToDisplay());
		this._accumulatedExp += this.expToDisplay() - this.expToDisplayNext()+1;
		
	}
};
Window_DrainMessage.prototype.isLvlUpWait = function(){
	if (this._lvlUpWait > 0){
		this._lvlUpWait --;
		return true;
	} else {
		return false;
	}
}

Window_DrainMessage.prototype.drawDrainGauge = function() {
	var lineHeight = this.lineHeight();
	this.drawName (this.battler, 0, 0 + lineHeight * 0, 210),
	this.drawLevel(this.battler, 214, 0 + lineHeight * 0);
	this.drawExp(this.battler, 0, 0 + lineHeight * 1, 300);
};

Window_DrainMessage.prototype.levelToDisplay = function() {
	return this.battler.level - this._accumulatedLvl - this._precachedLvl;
};

Window_DrainMessage.prototype.expToDisplay = function(){
	return this.battler.currentExp() - this._accumulatedExp - this._precachedExp - this.battler.expForLevel(this.levelToDisplay());
};

Window_DrainMessage.prototype.expToDisplayNext = function(){
	return this.battler.expForLevel(this.levelToDisplay() + 1) - this.battler.expForLevel(this.levelToDisplay());;
};

Window_DrainMessage.prototype.drawName = function(battler, x, y, width) {
    width = width || 168;
    this.drawText(battler.name(), x, y, width);
};

Window_DrainMessage.prototype.drawLevel = function(battler, x, y) {
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.levelA, x, y, 48, 'right');
    this.resetTextColor();
    this.drawText(this.levelToDisplay(), x + 50, y, 36, 'right');
};

Window_DrainMessage.prototype.drawExp = function(battler, x, y, width) {
    width = width || 186;
    var color1 = this.expGaugeColor1();
    var color2 = this.expGaugeColor2();
	var expRate = this.expToDisplay() / this.expToDisplayNext();
    this.drawGauge(x, y, width, expRate, color1, color2);
    this.changeTextColor(this.systemColor());
    this.drawText(TextManager.expA, x, y, 48);
    this.drawCurrentAndMax(this.expToDisplay(), this.expToDisplayNext(), x, y, width, this.expColor(), this.normalColor());
};

Window_DrainMessage.prototype.createLvlDrainPopup = function(x, y, amount) {
	var sprite = new Sprite_LvlDrainPopupWindow(amount); 
	sprite.updatePosition(x, y);
	sprite.createBitmap(this.width, this.lineHeight());
	sprite.setText();
    this.addChild(sprite);
};

Window_DrainMessage.prototype.createExpDrainPopup = function(amount) {
	var height = this.lineHeight() / 2 * 3;
	if (this.x + this.width/2 >= Graphics.width/2) {
		var sprite = new Sprite_ExpDrainPopupWindow(amount); 
		sprite.updatePosition(-sprite.bitmap.width - 5, height);
		sprite.setAlignment('right');
		sprite.setText();
	} else {
		var sprite = new Sprite_ExpDrainPopupWindow(amount); 
		sprite.updatePosition(this.width+5, height);
		sprite.setText();
	}
    this.addChild(sprite);
};

Window_DrainMessage.prototype.doesContinue = function() {
    return (this._accumulatedExp != 0 || this._precachedExp != 0);
};

Window_DrainMessage.prototype.startWait = function(count) {
    this._waitCount = count;
};

//-----------------------------------------------------------------------------
// Window_DrainMessagePlayer
//-----------------------------------------------------------------------------

function Window_DrainMessagePlayer() {
    this.initialize.apply(this, arguments);
}

Window_DrainMessagePlayer.prototype = Object.create(Window_DrainMessage.prototype);
Window_DrainMessagePlayer.prototype.constructor = Window_DrainMessagePlayer;

Window_DrainMessagePlayer.prototype.initialize = function() {
    var width = 340;
    var height = 108;
    var x = slinds.actorStatsX;
	var y = slinds.actorStatsY;
    Window_Base.prototype.initialize.call(this, x, y, width, height);
	this.openness = 0;
    this.initMembers();
};

Window_DrainMessagePlayer.prototype.detectBattler = function(){
	if(slinds.$drainActor){
		if (this.battler != slinds.$drainActor){
			this.battler = slinds.$drainActor;
			this.setup();
		}
		return true;		
	} else {
		return false;
	}
};
//=============================================================================
//
// rpg_sprites
//
//=============================================================================

//-----------------------------------------------------------------------------
// Spriteset_Base
//-----------------------------------------------------------------------------

var Spriteset_Base_createUpperLayer = Spriteset_Base.prototype.createUpperLayer;
Spriteset_Base.prototype.createUpperLayer = function() {
    Spriteset_Base_createUpperLayer.call(this);
	//this.createStatDrainPopupAnchor();
};

Spriteset_Base.prototype.createStatDrainPopupAnchor = function() {
    this._playerDrainSprite = new Sprite_PlayerDrainContainer();
	//this._npcDrainSprite = new Sprite_NpcDrainContainer();
    this.addChild(this._playerDrainSprite);
	//this.addChild(this._npcDrainSprite);
};

//-----------------------------------------------------------------------------
// Sprite_StatDrainContainer
//-----------------------------------------------------------------------------

function Sprite_StatDrainContainer() {
    this.initialize.apply(this, arguments);
}

Sprite_StatDrainContainer.prototype = Object.create(Sprite.prototype);
Sprite_StatDrainContainer.prototype.constructor = Sprite_StatDrainContainer;

Sprite_StatDrainContainer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);

	this.queue = new customQueue();
	this._childFlashDuration = 0;
	this._timer = 0;
	this.updatePosition();
	this.update();
	this.createBitmap();
};

Sprite_StatDrainContainer.prototype.update = function() {
	if (slinds.$drainActor != null){
		Sprite.prototype.update.call(this);
		this.detectDrain();
		if(this.timerOver()){
			if (this.queue.length() > 0){
				this.createDrainPopup(this.queue.dequeue());
				this.setupTimer(15);
			}
		}
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].update();
		}
	}
};
//-2 = exp, -1 = level, 0 = mhp, 1= mmp,
Sprite_StatDrainContainer.prototype.detectDrain = function(){	
	if (slinds.$drainActor.expGain !== 0) {
		this.queue.enqueue(new Sprite_ExpDrainPopup(0, 0, slinds.$drainActor.expGain)); 
		slinds.$drainActor.expGain = 0;
		if (slinds.$drainActor.lvlGain !== 0) {
			this.queue.enqueue(new Sprite_LvlDrainPopup(0, 0, slinds.$drainActor.lvlGain));
			slinds.$drainActor.lvlGain = 0;
		}
	}	
	if (slinds.$drainActor.isStatusDrain()){
		for (var i = 0; i < 8; i++){
			if (slinds.$drainActor.param(i) - slinds.$drainActor.oldParams[i] !== 0){
				this.queue.enqueue(new Sprite_ParamDrainPopup(0, 0, slinds.$drainActor.param(i) - slinds.$drainActor.oldParams[i]));
			}
		} 
		slinds.$drainActor.saveUnchangedParams();
	}
};

Sprite_StatDrainContainer.prototype.createDrainPopup = function(sprite) {
    this.addChild(sprite);
    return sprite;
};

Sprite_StatDrainContainer.prototype.updatePosition = function() {
    this.x = Graphics.width / 2 - this.width / 2;
    this.y = Graphics.height / 4 * 3 - this.height;
};

Sprite_StatDrainContainer.prototype.timerOver = function (){
	if (this._timer > 0) {
        this._timer--;
		return 0;
	}
	else{

		return 1;
	}	
};

Sprite_StatDrainContainer.prototype.setupTimer = function(time) {
	this._timer = time;
};

Sprite_StatDrainContainer.prototype.createBitmap = function(width, height) {
    this.bitmap = new Bitmap(350, 48);
    this.bitmap.fontSize = 42;
	this.bitmap.drawText('O', 0, 0, this.bitmap.width, this.bitmap.height, 'center')
};
//-----------------------------------------------------------------------------
// Sprite_PlayerDrainContainer
//-----------------------------------------------------------------------------

function Sprite_PlayerDrainContainer() {
    this.initialize.apply(this, arguments);
}

Sprite_PlayerDrainContainer.prototype = Object.create(Sprite_StatDrainContainer.prototype);
Sprite_PlayerDrainContainer.prototype.constructor = Sprite_PlayerDrainContainer;

Sprite_PlayerDrainContainer.prototype.initialize = function() {
    Sprite.prototype.initialize.call(this);
	this.queue = new slindsQueue();
	this._childFlashDuration = 0;
	this._timer = 0;
	this.updatePosition();
	this.update();
	this.createBitmap();
};

Sprite_StatDrainContainer.prototype.updatePosition = function() {
    this.x = Graphics.width / 3 * 2 - this.width / 2;
    this.y = Graphics.height / 2 - this.height / 2;
};

//-----------------------------------------------------------------------------
// Sprite_StatDrainPopup
//-----------------------------------------------------------------------------

function Sprite_StatDrainPopup(){
	this.initialize.apply(this, arguments);
}

Sprite_StatDrainPopup.prototype = Object.create(Sprite.prototype);
Sprite_StatDrainPopup.prototype.constructor = Sprite_StatDrainPopup;

Sprite_StatDrainPopup.prototype.initialize = function(amount){
	Sprite.prototype.initialize.call(this);
	this.anchor.x = 0;
    this.anchor.y = 0;
	this.amount = amount;
	this.duration = 240;
	this.flashDuration = 100
	this.flashColor = [0, 0, 0, 0];
	this.alignment = 'left';
	this.createBitmap();
	this.ry = this.y;
	this.dy = -2;
};

Sprite_StatDrainPopup.prototype.setColorPalette = function(){
	if (this.amount > 0){
		this.flashColor = [71, 255, 30, 127];
	} else {
		this.flashColor = [255, 71, 30, 127];
	}
	
};

Sprite_StatDrainPopup.prototype.addArrow = function() {
	if (this.amount > 0) {
		return '↑';
	} else {
		return '↓';
	}
};

Sprite_StatDrainPopup.prototype.addSymbol = function() {
	if (this.amount > 0) {
		return '+';
		
	}else {
		return '';
	}
};

Sprite_StatDrainPopup.prototype.createBitmap = function(w = 350, h = 48) {
    this.bitmap = new Bitmap(w, h);
    this.bitmap.fontSize = h-8;
	this.setColorPalette();	
};

Sprite_StatDrainPopup.prototype.update = function(){
	if (this.updateDuration()) {
		Sprite.prototype.update.call(this);
		this.movePopup();
		this.updateFlash();
		this.updateOpacity();
	}
};

Sprite_StatDrainPopup.prototype.updateDuration = function(){
	if(this.duration > 0){
		this.duration--;
		return true;
	} else{
		return false;
	} 
};

Sprite_StatDrainPopup.prototype.movePopup = function (){
	this.dy += 0.012;
	this.ry += this.dy;
	this.y = Math.round(this.ry);
	this.setBlendColor(this.flashColor);
};

Sprite_StatDrainPopup.prototype.updateOpacity = function() {
    if (this.duration < 15) {
        this.opacity = 255 * this.duration / 15;
    }
};

Sprite_StatDrainPopup.prototype.updateFlash = function() {
    if (this.flashDuration > 0) {
        var d = this.flashDuration--;
        this.flashColor[3] *= (d - 1) / d;
    }
};

Sprite_StatDrainPopup.prototype.text = function() {
	return this.addSymbol() + this.amount;
};

Sprite_StatDrainPopup.prototype.setAlignment = function(alignment) {
	this.alignment = alignment
};

Sprite_StatDrainPopup.prototype.setText = function(){
	this.bitmap.drawText(this.text(), 0, 0, this.bitmap.width, this.bitmap.height, this.alignment);
};

Sprite_StatDrainPopup.prototype.updatePosition = function(x, y) {
	this.x = x;
	this.y = y;
	this.ry = this.y;
};

Sprite_StatDrainPopup.prototype.playSe = function(name) {
	if(slinds.playSounds == 1){
		AudioManager.playSe({name: name, pan: 0, pitch: 100, volume: 70});
	}		
};
//-----------------------------------------------------------------------------
// Sprite_ExpDrainPopup
//-----------------------------------------------------------------------------

function Sprite_ExpDrainPopup() {
	this.initialize.apply(this, arguments);
}

Sprite_ExpDrainPopup.prototype = Object.create(Sprite_StatDrainPopup.prototype);
Sprite_ExpDrainPopup.prototype.constructor = Sprite_ExpDrainPopup;

Sprite_ExpDrainPopup.prototype.initialize = function(amount) {
	Sprite_StatDrainPopup.prototype.initialize.call(this, amount);
};

Sprite_ExpDrainPopup.prototype.text = function() {
	return this.addSymbol() + this.amount + TextManager.expA;
};

//-----------------------------------------------------------------------------
// Sprite_ExpDrainPopupWindow
//-----------------------------------------------------------------------------

function Sprite_ExpDrainPopupWindow() {
	this.initialize.apply(this, arguments);
}

Sprite_ExpDrainPopupWindow.prototype = Object.create(Sprite_ExpDrainPopup.prototype);
Sprite_ExpDrainPopupWindow.prototype.constructor = Sprite_ExpDrainPopupWindow;

Sprite_ExpDrainPopupWindow.prototype.initialize = function(amount) {
	Sprite_ExpDrainPopup.prototype.initialize.call(this, amount);
	this.duration = 45;
	this.flashDuration = 30
	this.dy = -1.25;
	if (amount > 0) {
		this.playSe(slinds.expUpSound);
	} else {
		this.playSe(slinds.expDownSound);
	}
};

Sprite_ExpDrainPopupWindow.prototype.movePopup = function (){
	this.dy += +0.25/this.duration;
	this.ry += this.dy;
	this.y = Math.round(this.ry);
	this.setBlendColor(this.flashColor);
};

//-----------------------------------------------------------------------------
// Sprite_LvlDrainPopup
//-----------------------------------------------------------------------------

function Sprite_LvlDrainPopup() {
	this.initialize.apply(this, arguments);
}

Sprite_LvlDrainPopup.prototype = Object.create(Sprite_StatDrainPopup.prototype);
Sprite_LvlDrainPopup.prototype.constructor = Sprite_LvlDrainPopup;

Sprite_LvlDrainPopup.prototype.initialize = function(amount) {
	Sprite_StatDrainPopup.prototype.initialize.call(this, amount);	
};

Sprite_LvlDrainPopup.prototype.text = function() {
	return this.addArrow() + TextManager.level + this.upOrDown();
};
Sprite_LvlDrainPopup.prototype.upOrDown = function (){
	if (this.amount > 0){
		return ' Up!'
	}else {
		return ' Down'
	}
}

//-----------------------------------------------------------------------------
// Sprite_LvlDrainPopupWindow for Window
//-----------------------------------------------------------------------------

function Sprite_LvlDrainPopupWindow() {
	this.initialize.apply(this, arguments);
}

Sprite_LvlDrainPopupWindow.prototype = Object.create(Sprite_LvlDrainPopup.prototype);
Sprite_LvlDrainPopupWindow.prototype.constructor = Sprite_LvlDrainPopupWindow;

Sprite_LvlDrainPopupWindow.prototype.initialize = function(amount) {
	Sprite_LvlDrainPopup.prototype.initialize.call(this, amount);
	this.dy = -1,25;
	this.duration = 45;
	// if (amount > 0) {
		// AudioManager.playSe({name: "Powerup", pan: 0, pitch: 100, volume: 50});
	// } else {
		// AudioManager.playSe({name: "Pollen", pan: 0, pitch: 110, volume: 50});
	// }
};

Sprite_LvlDrainPopupWindow.prototype.movePopup = function (){
	this.dy += +0.25/this.duration;
	this.ry += this.dy;
	this.y = Math.round(this.ry);
	this.setBlendColor(this.flashColor);
};

Sprite_LvlDrainPopupWindow.prototype.setColorPalette = function(){
	//this.bitmap.outlineWidth = 3;
	//this.bitmap.outlineColor = 'rgba(255, 255, 255, 1)';
	if (this.amount > 0){		
		this.bitmap.textColor = '#26ff26';
	} else {
		this.bitmap.textColor = '#ff2626';
	}
};

//-----------------------------------------------------------------------------
// Sprite_ParamDrainPopup
//-----------------------------------------------------------------------------

function Sprite_ParamDrainPopup() {
	this.initialize.apply(this, arguments);
}

Sprite_ParamDrainPopup.prototype = Object.create(Sprite_StatDrainPopup.prototype);
Sprite_ParamDrainPopup.prototype.constructor = Sprite_ParamDrainPopup;

Sprite_ParamDrainPopup.prototype.initialize = function(amount, paramiid) {
	Sprite_StatDrainPopup.prototype.initialize.call(this, amount);
	this.param = paramid;
};

Sprite_ParamDrainPopup.prototype.paramText = function(){
	switch(this.param){
	case 0:
		return TextManager.hpA;
	case 1:
		return TextManager.mpA;
	default:
		return TextManager.param(this.param)
	}
};

Sprite_ParamDrainPopup.prototype.text = function() {
	return this.addSymbol() + this.amount +' '+ this.paramText();
};

(function(){

//=============================================================================
//
// rpg_objects
//
//=============================================================================

//-----------------------------------------------------------------------------
// Game_Action
//-----------------------------------------------------------------------------

var Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	Game_Action_apply.call(this, target);
	if (target.result().isHit()) {
		if (this.item().meta.Leveldrain) {
			this.subject().levelDrain(this.item().meta.Leveldrain, target);
		}
		else if (this.item().meta.Expdrain) {
			this.subject().expDrain(this.item().meta.Expdrain, target);
		}
	}
};

//-----------------------------------------------------------------------------
// Game_Battler
//-----------------------------------------------------------------------------

Game_Battler_initialize = Game_Battler.prototype.initialize;
Game_Battler.prototype.initialize = function() {
	Game_Battler_initialize.call(this);
	this.lvlGain = 0;
	this.expGain = 0;
	this.lvlLost = 0;
	this.expLost = 0;
	this.expStolen = 0;
	this.lvlStolen = 0;
	this.hppercentage = 0;
	this.mppercentage = 0;
	this.drainParam = [];
	this.statDrain = false;
	this.resetStatusDrain();	
};

Game_Battler.prototype.updateDrainStatistics = function(){
	if (this.expGain > 0)
	{
		this.lvlStolen += this.lvlGain;
		this.expStolen += this.expGain;
	}
	else {
		this.lvlLost -= this.lvlGain;
		this.expLost -= this.expGain;
	}

};

Game_Battler.prototype.addDrainParam = function(param, amount){
	this.drainParam[param] += amount;
	this.refresh();
};

var Game_Battler_param = Game_Battler.prototype.param
Game_Battler.prototype.param = function(paramId) {
    var value = Game_Battler_param.call(this, paramId) + this.drainParam[paramId];
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

Game_Battler.prototype.expReducedFormat = function(message){
	return message.format(this.name(), Math.abs(this.expGain));	
};
Game_Battler.prototype.lvlMessageFormat = function(message){
	return message.format(this.name(), Math.abs(this.lvlGain), this.level, this.level - this.lvlGain);
};

Game_Battler.prototype.handleDrainMessage = function(){
	if (slinds.showDrainMessages == 1){	
		let message ='';
		if (this.expGain < 0) {
			message += this.expReducedFormat(slinds.expReducedMessage) + '\n';
			if (this.lvlGain < 0) {
				message += this.lvlMessageFormat(slinds.lvlReducedMessage) + '\n';
			}
		}
		else if (this.expGain > 0){
			if (this.lvlGain > 0) {
				message += this.lvlMessageFormat(slinds.lvlIncreasedMessage) + '\n';
			}
		}
		$gameMessage.newPage();
		$gameMessage.add(message);
	}
};

Game_Battler.prototype.expDrainFormula = function(amount) {
	this.expGain = amount;
	this.saveUnchangedParams();
	this.setParamPercentage(); 
	this.lvlGain = this.level;
	this.changeExp(this.currentExp() + this.expGain, 0);
	this.lvlGain = this.level - this.lvlGain;
	this.updateDrainStatistics();	
	this.handleDrainMessage();
	this.paramCorrection();
	// this.lvlGain = 0;
	// this.expGain = 0;
};

Game_Battler.prototype.levelDrainExpValue = function(amount, target){
	let value = 1;
	let mul = 1;
	if (amount < 1){
		mul = amount;
		amount = 1;
	}
	if (this.level > target.level){
		value = this.expForLevel(this.level + amount) - this.currentExp();
	}
	else {
		value = target.currentExp() - target.expForLevel(target.level - amount);	
	}
	return value * mul;
};

Game_Battler.prototype.levelDrain = function(amount, target) {
	if (target.isEnemy()){
		target = slinds.$leveledEnemies._data[target.nativeId];
	}
	if(target.level <= amount) {
		amount = target.level - 1;
	}
	if (this.isValidLevelDrain(amount, target)){
		this.expDrain(this.levelDrainExpValue(amount, target), target);
	}
};

Game_Battler.prototype.isValidLevelDrain = function(amount, target) {
	if (target.currentExp() > 1){
		if (amount > 0){
			return 1;
		}
	}
	else {
		return 0;
	}	
};

Game_Battler.prototype.expDrain = function(amount, target) {
	if (target.isEnemy()){
		target = slinds.$leveledEnemies._data[target.nativeId];
	}
	if(target.currentExp() <= amount) {
		amount = target.currentExp() - 1;
	}
	if (amount > 0){	
		target.expDrainFormula(-amount);	
		this.expDrainFormula(amount);
		this.setGlobalDrainBattlers(target, this);
	}
};

Game_Battler.prototype.setGlobalDrainBattlers = function(target, subject) {
	slinds.$drainActor = target;
	slinds.$drainEnemy = subject;
	if((target.isActor() && subject.isActor() && (target.actorId() > subject.actorId())) || !target.isActor()){
		slinds.$drainActor = subject;
		slinds.$drainEnemy = target;
	}
}

Game_Battler.prototype.statusDrainFormula = function(param, amount){
	this.saveUnchangedParams();
	this.addDrainParam(param, amount);
	this.statDrain = true;
	this.handleDrainMessage();
	this.saveUnchangedParams();
};

Game_Battler.prototype.statusDrain = function(param, amount, target){
	this.setGlobalDrainBattlers(target, this);
	if (target.isEnemy()){
		target = slinds.$leveledEnemies._data[target.nativeId];
	}
	if (target.param(param) <= amount) {
		amount = target.param(param) - 1;		
	}
	if (amount > 0) {
		target.statusDrainFormula(param, -amount)
		this.statusDrainFormula(param, amount)
	}
};

Game_Battler.prototype.saveUnchangedParams = function(){
	this.oldParams = [];
	for(var i = 0; i < 8; i++){
		this.oldParams[i] = this.param(i);
	}
};

Game_Battler.prototype.resetLevelDrain = function() {
	this.changeExp(this.currentExp() - this.expStolen + this.expLost)
	this.lvlLost = 0;
	this.expLost = 0;
	this.expStolen = 0;
	this.lvlStolen = 0;	
};

Game_Battler.prototype.resetStatusDrain = function() {
	for(var i = 0; i < 8; i++){
		this.drainParam[i] = 0;
	}
};

Game_Battler.prototype.resetAllDrain = function() {
	this.resetLevelDrain();
	this.resetStatusDrain();
};

Game_Battler.prototype.isStatusDrain = function(){
	return this.statDrain;
	this.statDrain = false;
};

//-----------------------------------------------------------------------------
// Game_Actor
//-----------------------------------------------------------------------------

Game_Actor.prototype.initDrainStats = function() {
	this.lvlGain = 0;
	this.expGain = 0;
	this.lvlLost = 0;
	this.expLost = 0;
	this.expStolen = 0;
	this.lvlStolen = 0;
	this.hppercentage = 0;
	this.mppercentage = 0;
	this.drainParam = [];
	this.resetStatusDrain();
};

Game_Actor.prototype.paramCorrection = function(){
	this.setHp(Math.ceil(this.mhp * this.hppercentage));
	this.setMp(Math.ceil(this.mmp * this.mppercentage));		
};

Game_Actor.prototype.setParamPercentage = function(){
	this.hppercentage = this.hp / this.mhp;
	this.mppercentage = this.mp / this.mmp;
};
//-----------------------------------------------------------------------------
// Game_Enemy
//-----------------------------------------------------------------------------

Game_Enemy.prototype.param = function(paramId) {
	var value = Game_BattlerBase.prototype.param.call(this, paramId);
	if (slinds.$leveledEnemies._data[this.nativeId]){
		value /= this.paramRate(paramId) * this.paramBuffRate(paramId);
		value += slinds.$leveledEnemies._data[this.nativeId].param(paramId) - 
		slinds.$leveledEnemies._data[this.nativeId].paramBase(paramId);
		value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
		var maxValue = this.paramMax(paramId);
		var minValue = this.paramMin(paramId);
		return Math.round(value.clamp(minValue, maxValue));
	}
	else{
		return value;
	}
};
	
var Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {	
	this.nativeId = enemyId;
	if(slinds.$leveledEnemies._data[enemyId]){
		slinds.$leveledEnemies._data[enemyId].refreshEnemy();
	}
	else
	{
		slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
	}	
	Game_Enemy_setup.call(this, enemyId, x, y);	
};

Game_Enemy.prototype.levelDrain = function(amount, target) {
	if(target.isEnemy()){
		target = slinds.$leveledEnemies._data[target.nativeId];
	}
	slinds.$leveledEnemies._data[this.nativeId].levelDrain(amount, target);
};

Game_Enemy.prototype.expDrain = function(amount, target) {
	if(target.isEnemy()){
		target = slinds.$leveledEnemies._data[target.nativeId];
	}
	slinds.$leveledEnemies._data[this.nativeId].expDrain(amount, target);
};

Game_Enemy.prototype.statusDrain = function(param, amount, target){
	if(target.isEnemy()){
		target = slinds.$leveledEnemies._data[target.nativeId];
	}
	slinds.$leveledEnemies._data[this.nativeId].statusDrain(param, amount, target);
};

//=============================================================================
//
// rpg_managers
//
//=============================================================================

//-----------------------------------------------------------------------------
// Datamanager
//-----------------------------------------------------------------------------

var DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
	DataManager_createGameObjects.call(this);
	slinds.$leveledEnemies = new Leveled_Enemies();
};

var DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	DataManager_extractSaveContents.call(this, contents);
	if(contents.enemyProgress != undefined){
		slinds.$leveledEnemies = contents.enemyProgress;	
	}
	for (var i = 0; i < $gameActors._data.length; i++){
		if($gameActors._data[i] && !$gameActors._data[i].drainParam){
			$gameActors._data[i].initDrainStats();
		}
	}
};

var DataManager_makeSaveContents = DataManager.makeSaveContents;
DataManager.makeSaveContents = function() {
	var contents = DataManager_makeSaveContents.call(this);
	contents.enemyProgress = slinds.$leveledEnemies;
	return contents;
};

//-----------------------------------------------------------------------------
// Game_Interpreter
//-----------------------------------------------------------------------------

Game_Interpreter.prototype.DetectGameVariable = function(argument) {
	let number = parseInt(argument.match(/\d+/));
	if (argument.toLowerCase().includes('\\v')){
		return $gameVariables._data[number];
	}
	else{
		return parseInt(argument);
	}	
};

//-----------------------------------------------------------------------------
// Plugin Commands
//-----------------------------------------------------------------------------

var Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function (command, args) {
	Game_Interpreter_pluginCommand.call(this, command, args);
	if (command.toLowerCase() === "leveldrain") {
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'leveldrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [amount] for 'leveldrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [actorId] for 'leveldrain'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var amount = this.DetectGameVariable(args[1]);
			var actorId = this.DetectGameVariable(args[2]);
			if (!slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
			}
			slinds.$leveledEnemies._data[enemyId].refreshEnemy();
			if(amount > 0){
				slinds.$leveledEnemies._data[enemyId].levelDrain(amount, $gameActors._data[actorId]);
			}
			else{
				$gameActors._data[actorId].levelDrain(-amount, slinds.$leveledEnemies._data[enemyId]);
			}
			//leveldrain enemy amount actor; Note: negative amount is leveldrain vs enemy
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "expdrain") {
		//expdrain enemy amount actor; Note: negative amount is expdrain vs enemy
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'expdrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [amount] for 'expdrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [actorId] for 'expdrain'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var amount = this.DetectGameVariable(args[1]);
			var actorId = this.DetectGameVariable(args[2]);
			if (!slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
			}
			slinds.$leveledEnemies._data[enemyId].refreshEnemy();
			if(amount > 0){
				slinds.$leveledEnemies._data[enemyId].expDrain(amount, $gameActors._data[actorId]);
			}
			else{
				$gameActors._data[actorId].expDrain(-amount, slinds.$leveledEnemies._data[enemyId]);
			}
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "actorleveldrain") {
		//allyleveldrain actor1 amount actor2;
		if(!args[0]){
			$gameMessage.add("missing argument [actorId1] for 'actorleveldrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [amount] for 'actorleveldrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [actorId2] for 'actorleveldrain'");
		}
		else{
			var actorId1 = this.DetectGameVariable(args[0]);
			var amount = this.DetectGameVariable(args[1]);
			var actorId2 = this.DetectGameVariable(args[2]);
			if(!gameActors._data[actorId1]){
				$gameActors._data[actorId1] = new Game_Actor(actorId1)
			}
			if(!gameActors._data[actorId2]){
				$gameActors._data[actorId2] = new Game_Actor(actorId2)
			}
			$gameActors._data[actorId1].levelDrain(amount, $gameActors._data[actorId2]);
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "actorexpdrain") {
		//allyexpdrain actor1 amount actor2;
		if(!args[0]){
			$gameMessage.add("missing argument [actorId1] for 'actorexpdrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [amount] for 'actorexpdrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [actorId2] for 'actorexpdrain'");
		}
		else{
			var actorId1 = this.DetectGameVariable(args[0]);
			var amount = this.DetectGameVariable(args[1]);
			var actorId2 = this.DetectGameVariable(args[2]);
			if(!$gameActors._data[actorId1]){
				$gameActors._data[actorId1] = new Game_Actor(actorId1)
			}
			if(!$gameActors._data[actorId2]){
				$gameActors._data[actorId2] = new Game_Actor(actorId2)
			}
			$gameActors._data[actorId1].expDrain(amount, $gameActors._data[actorId2]);
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "resetleveldrain") {
		//resetleveldrain all or resetleveldrain [enemyId]
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'resetleveldrain'");
		}
		else{
			if(args[0] == "all") {			
				for (var i = 0; slinds.$leveledEnemies._data.length > i; i++){
					if(slinds.$leveledEnemies._data[i]) {
						slinds.$leveledEnemies._data[i].resetLevelDrain();
					}
				}
			}
			else {
				var id = this.DetectGameVariable(args[0]);
				if(slinds.$leveledEnemies._data[id]) {
					slinds.$leveledEnemies._data[id].resetLevelDrain();
				}
			}
		}
	}
	if (command.toLowerCase() === "refundleveldrain") {	
		//refundleveldrain
		for (var i = 0; slinds.$leveledEnemies._data.length > i; i++){
			if(slinds.$leveledEnemies._data[i]) {
				slinds.$leveledEnemies._data[i].resetLevelDrain();
			}
		}
		for (var i = 0; $gameActors._data.length > i; i++){
			if($gameActors._data[i]) {
				$gameActors._data[i].resetLevelDrain();
			}
		}
	}
	if (command.toLowerCase() === "refundstatusdrain") {	
		//refundstatusdrain
		for (var i = 0; slinds.$leveledEnemies._data.length > i; i++){
			if(slinds.$leveledEnemies._data[i]) {
				slinds.$leveledEnemies._data[i].resetStatusDrain();
			}
		}
		for (var i = 0; $gameActors._data.length > i; i++){
			if($gameActors._data[i]) {
				$gameActors._data[i].resetStatusDrain();
			}
		}
	}
	if (command.toLowerCase() === "getenemylevel"){
		//getenemylevel [enemyId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'getenemylevel'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [game variable] for 'getenemylevel'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var gameVar = this.DetectGameVariable(args[1]);
			if(slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = slinds.$leveledEnemies._data[enemyId].level;
			}
			else{
				slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId);
				$gameVariables._data[gameVar] = slinds.$leveledEnemies._data[enemyId].level;
			}
		}
	}
	if (command.toLowerCase() === "getenemyexp"){
		//getenemyexp [enemyId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'getenemyexp'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [game variable] for 'getenemyexp'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var gameVar = this.DetectGameVariable(args[1]);
			if(slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = slinds.$leveledEnemies._data[enemyId]._exp;
			}
			else{
				slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId);
				slinds.$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = slinds.$leveledEnemies._data[enemyId]._exp;
			}
		}
	}
	if (command.toLowerCase() === "getenemydrainedlevel"){
		//getenemydrainedlevel [enemyId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'getenemydrainedlevel'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [game variable] for 'getenemydrainedlevel'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var gameVar = this.DetectGameVariable(args[1]);
			if(slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = slinds.$leveledEnemies._data[enemyId].lvlStolen;
			}
		}
	}
	if (command.toLowerCase() === "getenemydrainedexp"){
		//getenemydrainedexp [enemyId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'getenemydrainedexp'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [game variable] for 'getenemydrainedexp'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var gameVar = this.DetectGameVariable(args[1]);
			var enemy = slinds.$leveledEnemies._data[enemyId];
			if(slinds.$leveledEnemies._data[enemyId]){
				enemy.refreshEnemy();
				$gameVariables._data[gameVar] = enemy.expStolen;
			}
		}
	}
	if (command.toLowerCase() === "getactorslostlevel"){
		//getactorslostlevel [actorId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [actorId] for 'getactorslostlevel'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [game variable] for 'getactorslostlevel'");
		}
		else{
			var actorId = this.DetectGameVariable(args[0]);
			var gameVar = this.DetectGameVariable(args[1]);
			$gameVariables._data[gameVar] = $gameActors._data[actorId].lvlLost;
		}
	}
	if (command.toLowerCase() === "getactorslostexp"){
		//getactorslostexp [actorId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [actorId] for 'getactorslostexp'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [game variable] for 'getactorslostexp'");
		}
		else{
			var actorId = this.DetectGameVariable(args[0]);
			var gameVar = this.DetectGameVariable(args[1]);
			$gameVariables._data[gameVar] = $gameActors._data[actorId].expLost;
		}
	}
	if (command.toLowerCase() === "statusdrain") {
		//statusdrain enemy status amount actor; Note: negative amount is statusdrain vs enemy
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'statusdrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [status] for 'statusdrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [amount] for 'statusdrain'");
		}
		if(!args[3]){
			$gameMessage.add("missing argument [actorId] for 'statusdrain'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var status = args[1];
			var amount = this.DetectGameVariable(args[2]);
			var actorId = this.DetectGameVariable(args[3]);
			var param = null;
			if (!slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
			}
			if(status.toLowerCase() === "mhp"){
				param = 0;
			}
			else if(status.toLowerCase() === "mmp"){
				param = 1;
			}
			else if(status.toLowerCase() === "atk"){
				param = 2;
			}
			else if(status.toLowerCase() === "def"){
				param = 3;
			}
			else if(status.toLowerCase() === "mat"){
				param = 4;
			}
			else if(status.toLowerCase() === "mdf"){
				param = 5;
			}
			else if(status.toLowerCase() === "agi"){
				param = 6;
			}
			else if(status.toLowerCase() === "lck"){
				param = 7;
			}
			if(!param) {
				if(amount > 0){
					slinds.$leveledEnemies._data[enemyId].statusDrain(param, amount, $gameActors._data[actorId]);
				}
				else {
					$gameActors._data[actorId].statusDrain(param, -amount, slinds.$leveledEnemies._data[enemyId]);
				}
			}
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "actorstatusdrain") {
		//allystatusdrain actor status amount actor;
		if(!args[0]){
			$gameMessage.add("missing argument [actorId1] for 'actorstatusdrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [status] for 'actorstatusdrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [amount] for 'actorstatusdrain'");
		}
		if(!args[3]){
			$gameMessage.add("missing argument [actorId2] for 'actorstatusdrain'");
		}
		else{
			var enemyId = this.DetectGameVariable(args[0]);
			var status = args[1];
			var amount = this.DetectGameVariable(args[2]);
			var actorId = this.DetectGameVariable(args[3]);
			var param = null;
			if (!slinds.$leveledEnemies._data[enemyId]){
				slinds.$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
			}
			if(status.toLowerCase() === "mhp"){
				param = 0;
			}
			else if(status.toLowerCase() === "mmp"){
				param = 1;
			}
			else if(status.toLowerCase() === "atk"){
				param = 2;
			}
			else if(status.toLowerCase() === "def"){
				param = 3;
			}
			else if(status.toLowerCase() === "mat"){
				param = 4;
			}
			else if(status.toLowerCase() === "mdf"){
				param = 5;
			}
			else if(status.toLowerCase() === "agi"){
				param = 6;
			}
			else if(status.toLowerCase() === "lck"){
				param = 7;
			}
			if(!param) {
				if(amount > 0){
					$gameActors._data[actorId1].statusDrain(param, amount, slinds.$leveledEnemies._data[actorId2]);
				}
				else {
					$gameActors._data[actorId2].statusDrain(param, -amount, slinds.$leveledEnemies._data[actorId1]);
				}
			}
			this.setWaitMode('message');
		}
	}
};	
})();
