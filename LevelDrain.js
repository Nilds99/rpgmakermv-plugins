//=============================================================================
// LevelDrain.js
// v1.0 Release
// v1.1 Bugfixes, added stats-display, added plugin command "showenemystats [Enemy]"
// v1.2 Improved drain messages, added status drain mechanic, minor code improvements
//=============================================================================
/*:
 * @plugindesc v1.1 Level and experience drain for enemies and actors.
 * @author Slinds
 *
 * @param Level reduced message
 * @desc %1 = target name %2 = lost Level %3 = lost Exp %4 subject name %5 = new line
 * @default The Level of %1 decreased by %2 (Exp drained: %3)
 *
 * @param Exp reduced message
 * @desc %1 = target name %2 = lost Exp %3 = subject name %4 = new line
 * @default %1 got %2 Exp drained
 *
 * @param Level increased message
 * @desc %1 = subject name %2 = gained Level %3 = new level %4 = gained Exp %5 = new line
 * @default %1's Level +%2%5%1 went up to Level %3
 *
 * @param Show messages
 * @desc 1 = show, 0 = don't show                          
 * @default 1
 *
 * @param Show stats
 * @desc 1 = show, 0 = don't show                          
 * @default 1
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
 * leveldrain [Enemy] [Amount] [Actor] 
 * -> level drain between enemy and actor.
 *    Note: If you put in a negative amount, the enemy gets drained by the actor.
 *
 * expdrain [Enemy] [Amount] [Actor]
 * -> level drain between enemy and actor.
 *    Note: If you put in a negative amount, the enemy gets drained by the actor.
 * 
 * allyleveldrain [Actor] [Amount] [Target Actor]
 * -> level drain between two actors.
 * 
 * statusdrain [Enemy] [status] [Amount] [Actor]
 * -> status drain between enemy and actors.
 *    Note1: If you put in a negative amount, the enemy gets drained by the actor.
 *    Note2: statuses: mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * allystatusdrain [Actor] [status] [Amount] [Target Actor]
 * -> status drain between two actors.
 *    Note: statuses: mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * allyexpdrain [Actor] [Amount] [Target Actor]
 * -> exp drain between two actors.
 * 
 * showenemystats [Enemy]
 * -> displays the enemy's stats
 *
 * resetleveldrain [Enemy]							
 * -> replace [Enemy] with the enemy Id to reset the level to the start values.
 *    Note: you can also use "resetleveldrain all" to reset all.
 * 
 * refundleveldrain	
 * -> sets all enemies level to the start values and gives actors all lost 
 *    exp and level back. 
 * 
 * getactorslostlevel [Actor] [game variable]
 * -> writes the lost level of an specific actor into an game variable
 *
 * getactorslostexp [Actor] [game variable]
 * -> writes the lost exp of an specific actor into an game variable
 * 
 * getenemylevel [Enemy] [game variable]			
 * -> writes the level of the specified enemy into an game variable
 * 
 * getenemyexp [Enemy] [game variable]
 * -> writes the exp of the specified enemy into an game variable
 *
 * getenemydrainedlevel [Enemy] [game variable]
 * -> writes the drained level of the enemy into an game variable
 *
 * getenemydrainedexp [Enemy] [game variable]
 * -> writes the drained exp of the enemy into an game variable
 * 
*/

/*:ja
 * @plugindesc v1.1敵やアクターのレベルや経験値ドレイン
 * @author Slinds
 *
 * @param Level reduced message
 * @desc %1 = 目標名 %2 = ロストレベル %3 = ロストExp %4 被験者名 %5 = 改行
 * @default %1のレベルが %2 下がった（Expドレイン %3）
 *
 * @param Exp reduced message
 * @desc %1 = 目標名 %2 = ロストExp %3 = 被験者名 %4 = 改行
 * @default %1は %2 Expを失った 
 *
 * @param Level increased message
 * @desc %1 = 被験者名 %2 = 収集されたレベル %3 = 新しいレベル %4 = 収集されたExp %5 = 改行
 * @default %1のレベル +%2%5%1はレベル %3 に上がった
 *
 * @param Show messages
 * @desc 1 = ショーメッセージ, 0 = メッセージを表示しない                        
 * @default 1
 *
 * @param Show stats
 * @desc 1 = ショーメッセージ, 0 = メッセージを表示しない                        
 * @default 1
 *
 * @param Class
 * @desc 敵のExpカーブのクラスを設定 デフォルト：1（ファーストクラス）                           
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
 * allyleveldrain [アクターID] [量] [ターゲットアクターID]
 * -> 二人のアクター間のレベルドレイン。
 * 
 * allyexpdrain [アクターID] [量] [ターゲットアクターID]
 * -> 二人のアクター間のエクスペリエンスドレイン。
 * 
 * showenemystats [エネミーID]
 * -> 敵のステータスを見る
 *
 * statusdrain [エネミーID] [ステータス] [量] [アクターID]。
 * -> 敵とアクター間のステータス・ドレイン。
 * 注1：マイナスの金額を入れると、敵はアクターからドレインされる。
 * 注2：ステータス： mhp, mmp, atk, def, mat, mdf, agi, lck
 *
 * allystatusdrain [アクターID] [ステータス] [量] [ターゲットアクターID]。
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

var parameters = PluginManager.parameters('LevelDrain');
var enemyClass = Number(parameters['Class']);

var $leveledEnemies = null;

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
};

Leveled_Enemy.prototype.name = function(){
	return this._name;
};

Leveled_Enemy.prototype.refreshEnemy = function () {
	var enemy = $dataEnemies[this.enemyId];
	this._name = enemy.name;
	this.classId = enemyClass;
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
    return $dataClasses[enemyClass];
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

Leveled_Enemy.prototype.applyStatsOnTroop = function(){
	if($gameParty.inBattle()){
		for(var i = 0; $gameTroop._enemies.length > i; i++) {
			if ($gameTroop._enemies[i].id = this.enemyId)
			{
				$gameTroop._enemies[i].levelStats(this.lvlGain);
			}
		}
	}
};

Leveled_Enemy.prototype.changeLevel = function(level, show) {;
    this.changeExp(this.expForLevel(level));
};

Leveled_Enemy.prototype.enemy = function() {
    return $dataEnemies[this.enemyId];
};

Leveled_Enemy.prototype.paramBase = function(paramId) {
    return this.enemy().params[paramId];
};

Leveled_Enemy.prototype.paramCorrection = function(){
	this.applyStatsOnTroop();
};

Leveled_Enemy.prototype.levelParam = function(paramId) {
	switch(paramId) {
		case 0:
			if(this.enemy().meta.mhp){
					this._paramPlus[0] = parseInt(this.enemy().meta.mhp) * this.levelAlteration();
			}
			break;
		case 1:
			if(this.enemy().meta.mmp){	
				this._paramPlus[1] = parseInt(this.enemy().meta.mmp) * this.levelAlteration();
			}
			break;
		case 2:
			if(this.enemy().meta.atk){
				this._paramPlus[2] = parseInt(this.enemy().meta.atk) * this.levelAlteration();
			}
			break;
		case 3:
			if(this.enemy().meta.def){
				this._paramPlus[3] = parseInt(this.enemy().meta.def) * this.levelAlteration();
			}
			break;
		case 4:
			if(this.enemy().meta.mat){
				this._paramPlus[4] = parseInt(this.enemy().meta.mat) * this.levelAlteration();
			}
			break;
		case 5:
			if(this.enemy().meta.mdf){
				this._paramPlus[5] = parseInt(this.enemy().meta.mdf) * this.levelAlteration();	
			}
			break;
		case 6:
			if(this.enemy().meta.agi){
				this._paramPlus[6] = parseInt(this.enemy().meta.agi) * this.levelAlteration();
			}
			break;
		case 7:
			if(this.enemy().meta.lck){
				this._paramPlus[7] = parseInt(this.enemy().meta.lck) * this.levelAlteration();		
			}	
			break;
		default:
	}
};

Leveled_Enemy.prototype.param = function(paramId) {
	this.levelParam(paramId);
    var value = this.paramBase(paramId) + this.paramPlus(paramId) + this.drainParam[paramId];
    value *= this.paramRate(paramId) * this.paramBuffRate(paramId);
    var maxValue = this.paramMax(paramId);
    var minValue = this.paramMin(paramId);
    return Math.round(value.clamp(minValue, maxValue));
};

(function(){

//-----------------------------------------------------------------------------
// Addition to Game_Action
//-----------------------------------------------------------------------------

var Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
	Game_Action_apply.call(this, target);
	if (target.result().isHit()) {
		if (this.item().meta.Leveldrain) {
			if (target.isActor()){
				if (this.subject().isEnemy() && $leveledEnemies._data[this.subject().nativeId]) {
					$leveledEnemies._data[this.subject().nativeId].levelDrain(this.item().meta.Leveldrain, target);
					
				}
				else{
					$gameActors._data[this.subject()._actorId].levelDrain(this.item().meta.Leveldrain, target);
				}
			}
			else{
				if(this.subject().isEnemy() && $leveledEnemies._data[target.nativeId] && $leveledEnemies._data[this.subject().nativeId]){
					$leveledEnemies._data[this.subject().nativeId].levelDrain(this.item().meta.Leveldrain, $leveledEnemies._data[target.nativeId]);
				}
				else if($leveledEnemies._data[target.nativeId]) {
					$gameActors._data[this.subject()._actorId].levelDrain(this.item().meta.Leveldrain, $leveledEnemies._data[target.nativeId]);
				}
			}
		}	
		else if (this.item().meta.Expdrain) {
			if (target.isActor()){
				if (this.subject().isEnemy() && $leveledEnemies._data[this.subject().nativeId]) {
					//Enemy vs Actor
					$leveledEnemies._data[this.subject().nativeId].expDrain(this.item().meta.Expdrain, target);
				}
				else{ 
					//Actor vs Actor
					$gameActors._data[this.subject()._actorId].expDrain(this.item().meta.Expdrain, target)
				}
			}
			else{ 
				//Enemy vs Enemy
				if(this.subject().isEnemy() && $leveledEnemies._data[target.nativeId] && $leveledEnemies._data[this.subject().nativeId]){
					$leveledEnemies._data[this.subject().nativeId].expDrain(this.item().meta.Expdrain, $leveledEnemies._data[target.nativeId]);
				}
				//Actor vs Enemy
				else if($leveledEnemies._data[target.nativeId]) {
					$gameActors._data[this.subject()._actorId].expDrain(this.item().meta.Expdrain, $leveledEnemies._data[target.nativeId]);
				}
			}	
		}
	}
};

//-----------------------------------------------------------------------------
// Datamanager
//-----------------------------------------------------------------------------

var DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
	DataManager_createGameObjects.call(this);
	$leveledEnemies = new Leveled_Enemies();
};

var DataManager_extractSaveContents = DataManager.extractSaveContents;
DataManager.extractSaveContents = function(contents) {
	DataManager_extractSaveContents.call(this, contents);
	if(contents.enemyProgress != undefined){
		$leveledEnemies = contents.enemyProgress;	
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
	contents.enemyProgress = $leveledEnemies;
	return contents;
};

//-----------------------------------------------------------------------------
// Additions to Game_Battler
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

Game_Battler.prototype.setParamPercentage = function(){
	if(this.isActor()){
		this.hppercentage = this.hp / this.mhp;
		this.mppercentage = this.mp / this.mmp;
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

Game_Battler.prototype.levelDrain = function(amount, target) {
	if(target.level <= amount) {
		amount = target.level - 1;
	}
	if (amount > 0){	
		this.expDrain(target.currentExp() - target.expForLevel(target.level - amount), target);
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
	if (parameters['Show messages'] == 1){	
		if(parameters['Show stats'] == 1 || !parameters['Show stats']) {
			this.displayStatsUp();
		}
		else if (this.levelGain > 0) {
			this.displayDrainLevelUp();
		}		
		else if (this.levelGain < 0) {
			this.displayLvlDrain(-this.lvlGain, this.name());
		}
		else if (this.expGain < 0) {
			this.displayExpDrain(this.name());
		}
	}
	this.paramCorrection();
	this.lvlGain = 0;
	this.expGain = 0;
};

Game_Battler.prototype.expDrain = function(amount, target) {
	if(target.currentExp() <= amount) {
		amount = target.currentExp() - 1;
	}
	if (amount > 0){	
		target.expDrainFormula(-amount);	
		this.expDrainFormula(amount);
	}
};

Game_Battler.prototype.statusDrainFormula = function(param, amount, target){
	this.saveUnchangedParams();
	this.addDrainParam(param, amount);
	this.paramCorrection();
	this.displayStatsUp();
	this.saveUnchangedParams();
};

Game_Battler.prototype.statusDrain = function(param, amount, target){
	if (target.param(param) <= amount) {
		amount = target.param(param) - 1;		
	}
	if (amount > 0) {
		target.statusDrainFormula(param, -amount, target)
		this.statusDrainFormula(param, amount, target)
	}
};

Game_Battler.prototype.displayLvlDrain = function(amount, targetName){
	var levelDown = parameters['Level reduced message'].format(targetName, amount, this.expGain, 
	this.name(), '\n');
	$gameMessage.newPage();
	$gameMessage.add(levelDown);

};

Game_Battler.prototype.displayExpDrain = function(targetName){
	var ExpDown = parameters['Exp reduced message'].format(targetName, this.expGain, this.name(), '\n');
	$gameMessage.newPage();
	$gameMessage.add(ExpDown);
};

Game_Battler.prototype.displayDrainLevelUp = function(){
	var levelUp = parameters['Level increased message'].format(this.name(), this.lvlGain, this.level, 
	this.expGain, '\n');
	$gameMessage.newPage();
	$gameMessage.add(levelUp);
};

Game_Battler.prototype.saveUnchangedParams = function(){
	this.oldParams = [];
	for(var i = 0; i < 8; i++){
		this.oldParams[i] = this.param(i);
	}
};

Game_Battler.prototype.levelDisplayFormat = function() {
	var stat = '[' + this.name() +' \\c[0]' + TextManager.level + '\\c[0] ' + 
	(this.level - this.lvlGain);
	if (this.lvlGain > 0) {
		stat += ' \\c[24]+' + this.lvlGain + '\\c[0]';
	}
	else if (this.lvlGain < 0) {
		stat += ' \\c[18]' + this.lvlGain + '\\c[0]';
	}
	return stat + '] - ';
};

Game_Battler.prototype.expDisplayFormat = function(padCurrent, padAddition) {
	var stat = '\\c[0]' + TextManager.expA + '\\c[0]' + 
	(this.currentExp() - this.expGain).toString().padStart(padCurrent);
	if (this.expGain > 0) {
		stat += ' \\c[24]+' + this.expGain.toString().padEnd(padAddition) + '\\c[0]';
	}
	else if (this.expGain < 0) {
		stat += ' \\c[18]' + this.expGain.toString().padEnd(padAddition+1) + '\\c[0]';
	}
	else {
		stat += ''.padStart(padAddition+2);
	}
	return stat;
};

Game_Battler.prototype.statsDisplayFormat = function(statText, padStat, padCurrent, 
padAddition, param, fillstring = ' ') {
	var stat = '\\c[16]' + statText.padEnd(padStat, fillstring) + '\\c[0]' + 
	this.oldParams[param].toString().padStart(padCurrent);
	var paramGain = this.param(param) - this.oldParams[param];
	if (paramGain > 0) {
		stat += ' \\c[24]+' + paramGain.toString().padEnd(padAddition) + '\\c[0]';
	}
	else if (paramGain < 0) {
		stat += ' \\c[18]' + paramGain.toString().padEnd(padAddition+1) + '\\c[0]';
	}
	else {
		stat += ''.padStart(padAddition+2);
	}
	return stat;
};

Game_Battler.prototype.displayStatsUp = function() {
	var stats = this.levelDisplayFormat();
	stats += this.expDisplayFormat(8, 8)+ '\n';
	stats += this.statsDisplayFormat(TextManager.hpA, 3, 6, 5, 0);
	stats += this.statsDisplayFormat(TextManager.mpA, 3, 6, 5, 1) + '\n';
	stats += this.statsDisplayFormat(TextManager.param(2), 4, 4, 5, 2);
	stats += this.statsDisplayFormat(TextManager.param(4), 4, 4, 5, 4);
	stats += this.statsDisplayFormat(TextManager.param(5), 4, 4, 5, 5) + '\n';
	stats += this.statsDisplayFormat(TextManager.param(3), 4, 4, 5, 3);
	stats += this.statsDisplayFormat(TextManager.param(6), 4, 4, 5, 6);
	stats += this.statsDisplayFormat(TextManager.param(7), 4, 4, 5, 7, '　');
	$gameMessage.newPage();
	$gameMessage.add(stats);
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

//-----------------------------------------------------------------------------
// Additions to Game_Actor
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
	this.setHp(Math.round(this.mhp * this.hppercentage));
	this.setMp(Math.round(this.mmp * this.mppercentage));		
};

//-----------------------------------------------------------------------------
// Additions to Game_Enemy
//-----------------------------------------------------------------------------

Game_Enemy.prototype.levelStats = function() {
	storedEnemy = $leveledEnemies._data[this._enemyId];
	storedEnemy.refreshEnemy();
	var lvlA = storedEnemy.levelAlteration()
	
	this.hppercentage = this.hp / this.mhp;
	this.mppercentage = this.mp / this.mmp;
	if(this.enemy().meta.mhp){
		this.addParam(0, parseInt(this.enemy().meta.mhp) * lvlA + storedEnemy.drainParam[0]);
		this.setHp(Math.round(this.mhp * this.hppercentage));
	}
	if(this.enemy().meta.mmp){	
		this.addParam(1, parseInt(this.enemy().meta.mmp) * lvlA + storedEnemy.drainParam[1]);
		this.setMp(Math.round(this.mmp * this.mppercentage));
	}
	if(this.enemy().meta.atk){
		this.addParam(2, parseInt(this.enemy().meta.atk) * lvlA + storedEnemy.drainParam[2]);
	}
	if(this.enemy().meta.def){
		this.addParam(3, parseInt(this.enemy().meta.def) * lvlA + storedEnemy.drainParam[3]);
	}
	if(this.enemy().meta.mat){
		this.addParam(4, parseInt(this.enemy().meta.mat) * lvlA + storedEnemy.drainParam[4]);
	}
	if(this.enemy().meta.mdf){
		this.addParam(5, parseInt(this.enemy().meta.mdf) * lvlA + storedEnemy.drainParam[5]);	
	}
	if(this.enemy().meta.agi){
		this.addParam(6, parseInt(this.enemy().meta.agi) * lvlA + storedEnemy.drainParam[6]);
	}
	if(this.enemy().meta.lck){
		this.addParam(7, parseInt(this.enemy().meta.lck) * lvlA + storedEnemy.drainParam[7]);		
	}	
};
	
var Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {	
	Game_Enemy_setup.call(this, enemyId, x, y);	
	this.nativeId = enemyId;
	if($leveledEnemies._data[this._enemyId]){
		$leveledEnemies._data[this._enemyId].refreshEnemy();
		this.levelStats();
	}
	else
	{
		$leveledEnemies._data[this._enemyId] = new Leveled_Enemy(this._enemyId); 
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
			var enemyId = parseInt(args[0]);
			var amount = parseInt(args[1]);
			var actorId = parseInt(args[2]);
			if (!$leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
			}
			$leveledEnemies._data[enemyId].refreshEnemy();
			if(amount > 0){
				$leveledEnemies._data[enemyId].levelDrain(amount, $gameActors._data[actorId]);
			}
			else{
				$gameActors._data[actorId].levelDrain(-amount, $leveledEnemies._data[enemyId]);
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
			var enemyId = parseInt(args[0]);
			var amount = parseInt(args[1]);
			var actorId = parseInt(args[2]);
			if (!$leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
			}
			$leveledEnemies._data[enemyId].refreshEnemy();
			if(amount > 0){
				$leveledEnemies._data[enemyId].expDrain(amount, $gameActors._data[actorId]);
			}
			else{
				$gameActors._data[actorId].expDrain(-amount, $leveledEnemies._data[enemyId]);
			}
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "allyleveldrain") {
		//allyleveldrain actor1 amount actor2;
		if(!args[0]){
			$gameMessage.add("missing argument [actorId1] for 'allyleveldrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [amount] for 'allyleveldrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [actorId2] for 'allyleveldrain'");
		}
		else{
			var actorId1 = parseInt(args[0]);
			var amount = parseInt(args[1]);
			var actorId2 = parseInt(args[2]);
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
	if (command.toLowerCase() === "allyexpdrain") {
		//allyexpdrain actor1 amount actor2;
		if(!args[0]){
			$gameMessage.add("missing argument [actorId1] for 'allyexpdrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [amount] for 'allyexpdrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [actorId2] for 'allyexpdrain'");
		}
		else{
			var actorId1 = parseInt(args[0]);
			var amount = parseInt(args[1]);
			var actorId2 = parseInt(args[2]);
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
				for (var i = 0; $leveledEnemies._data.length > i; i++){
					if($leveledEnemies._data[i]) {
						$leveledEnemies._data[i].resetLevelDrain();
					}
				}
			}
			else {
				var id = parseInt(args[0]);
				if($leveledEnemies._data[id]) {
					$leveledEnemies._data[id].resetLevelDrain();
				}
			}
		}
	}
	if (command.toLowerCase() === "refundleveldrain") {	
		//refundleveldrain
		for (var i = 0; $leveledEnemies._data.length > i; i++){
			if($leveledEnemies._data[i]) {
				$leveledEnemies._data[i].resetLevelDrain();
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
		for (var i = 0; $leveledEnemies._data.length > i; i++){
			if($leveledEnemies._data[i]) {
				$leveledEnemies._data[i].resetStatusDrain();
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
			var enemyId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
			if($leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = $leveledEnemies._data[enemyId].level;
			}
			else{
				$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId);
				$gameVariables._data[gameVar] = $leveledEnemies._data[enemyId].level;
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
			var enemyId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
			if($leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = $leveledEnemies._data[enemyId]._exp;
			}
			else{
				$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId);
				$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = $leveledEnemies._data[enemyId]._exp;
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
			var enemyId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
			if($leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId].refreshEnemy();
				$gameVariables._data[gameVar] = $leveledEnemies._data[enemyId].lvlStolen;
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
			var enemyId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
			var enemy = $leveledEnemies._data[enemyId];
			if($leveledEnemies._data[enemyId]){
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
			var actorId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
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
			var actorId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
			$gameVariables._data[gameVar] = $gameActors._data[actorId].expLost;
		}
	}
	if (command.toLowerCase() === "showenemystats"){
		//showenemystats [enemyId] [game variable]
		if(!args[0]){
			$gameMessage.add("missing argument [enemyId] for 'showenemystats'");
		}
		else{
			var actorId = parseInt(args[0]);
			var gameVar = parseInt(args[1]);
			$gameVariables._data[gameVar] = $leveledEnemies._data[enemyId].displayStatsUp();
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
			var enemyId = parseInt(args[0]);
			var status = args[1];
			var amount = parseInt(args[2]);
			var actorId = parseInt(args[3]);
			var param = null;
			if (!$leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
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
					$leveledEnemies._data[enemyId].statusDrain(param, amount, $gameActors._data[actorId]);
				}
				else {
					$gameActors._data[actorId].statusDrain(param, -amount, $leveledEnemies._data[enemyId]);
				}
			}
			this.setWaitMode('message');
		}
	}	
	if (command.toLowerCase() === "allystatusdrain") {
		//allystatusdrain actor status amount actor;
		if(!args[0]){
			$gameMessage.add("missing argument [actorId1] for 'allystatusdrain'");
		}
		if(!args[1]){
			$gameMessage.add("missing argument [status] for 'allystatusdrain'");
		}
		if(!args[2]){
			$gameMessage.add("missing argument [amount] for 'allystatusdrain'");
		}
		if(!args[3]){
			$gameMessage.add("missing argument [actorId2] for 'allystatusdrain'");
		}
		else{
			var enemyId = parseInt(args[0]);
			var status = args[1];
			var amount = parseInt(args[2]);
			var actorId = parseInt(args[3]);
			var param = null;
			if (!$leveledEnemies._data[enemyId]){
				$leveledEnemies._data[enemyId] = new Leveled_Enemy(enemyId); 
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
					$gameActors._data[actorId1].statusDrain(param, amount, $leveledEnemies._data[actorId2]);
				}
				else {
					$gameActors._data[actorId2].statusDrain(param, -amount, $leveledEnemies._data[actorId1]);
				}
			}
			this.setWaitMode('message');
		}
	}
};	
})();
