import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  public type Language = {
    #en;
    #de;
    #fr;
    #it;
    #es;
    #pt;
    #ru;
    #ja;
    #zh;
    #ar;
    #ko;
    #hi;
  };

  func languageToText(language : Language) : Text {
    switch (language) {
      case (#en) { "en" };
      case (#de) { "de" };
      case (#fr) { "fr" };
      case (#it) { "it" };
      case (#es) { "es" };
      case (#pt) { "pt" };
      case (#ru) { "ru" };
      case (#ja) { "ja" };
      case (#zh) { "zh" };
      case (#ar) { "ar" };
      case (#ko) { "ko" };
      case (#hi) { "hi" };
    };
  };

  public type ChatRole = { #user; #assistant };

  public type Message = {
    role : ChatRole;
    content : Text;
    imageBytes : ?Blob;
    width : ?Nat;
    height : ?Nat;
    timestamp : Int;
  };

  public type ContentRequest = {
    createScript : Bool;
    scriptLanguage : Language;
    voiceLanguage : Language;
    includeSubtitles : Bool;
    subtitleLanguage : Language;
    autoTranslateSubtitles : Bool;
  };

  public type Storyboard = {
    scenes : [Text];
  };

  public type AnimationPlan = {
    steps : [Text];
  };

  public type ExportPlan = {
    script : Text;
    storyboard : Storyboard;
    animationPlan : AnimationPlan;
    exportFormat : Text;
    compressionMethod : Text;
    qualityLevel : Text;
    outputDestination : Text;
  };

  public type VideoRequest = {
    creator : Principal;
    videoTitle : Text;
    mainTopic : Text;
    requirements : ContentRequest;
  };

  public type VideoResponse = {
    script : Text;
    storyboard : Storyboard;
    animationPlan : AnimationPlan;
    exportPlan : ExportPlan;
    subtitles : [Text];
  };

  public type ColdEmailRequest = {
    recipient : Text;
    subject : Text;
    targetCompany : Text;
    companySector : Text;
    useCase : Text;
    personalization : Text;
    productDetails : Text;
    meetingRequest : Text;
  };

  public type ColdEmailResponse = {
    subjectLines : [Text];
    mainEmail : Text;
    followUp1 : Text;
    followUp2 : Text;
    finalOutput : Text;
  };

  public type UserProfile = {
    displayName : Text;
    avatar : Text;
    principal : Principal;
  };

  public type VoiceGender = {
    #male;
    #female;
  };

  public type VoiceSpeed = {
    #slow;
    #normal;
    #fast;
  };

  public type Emotion = {
    #normal;
    #energetic;
    #serious;
  };

  public type SubtitleStyle = {
    #simple;
    #bold;
    #mrbeastStyle;
  };

  public type VoiceoverRequest = {
    script : Text;
    voiceGender : VoiceGender;
    language : Language;
    speed : VoiceSpeed;
    emotion : Emotion;
  };

  public type SubtitleRequest = {
    script : Text;
    language : Language;
    style : SubtitleStyle;
  };

  public type SeoPackRequest = {
    videoTitle : Text;
    mainTopic : Text;
  };

  public type SeoPackResponse = {
    titles : [Text];
    description : Text;
    tags : [Text];
    hashtags : [Text];
    pinnedComment : Text;
    chapters : [Text];
  };

  public type ImageGenerationParams = {
    prompt : Text;
    negativePrompt : Text;
    seed : Nat64;
    steps : Nat;
    guidanceScale : Float;
    samplerMethod : Text;
    model : Text;
    imageBase64 : Text;
  };

  public type CoinPurchasePlan = {
    id : Nat;
    name : Text;
    coinAmount : Nat;
    price : Text;
  };

  public type TransactionType = {
    #credit;
    #debit;
    #featureUsage;
  };

  public type TransactionRecord = {
    timestamp : Int;
    principal : Principal;
    transactionType : TransactionType;
    amount : Nat;
    feature : Text;
    balanceAfter : Nat;
  };

  let coinPurchasePlans = [
    {
      id = 1;
      name = "Small Coin Pack";
      coinAmount = 500;
      price = "0.001 ICP";
    },
    {
      id = 2;
      name = "Medium Coin Pack";
      coinAmount = 1200;
      price = "0.002 ICP";
    },
    {
      id = 3;
      name = "Large Coin Pack";
      coinAmount = 2500;
      price = "0.004 ICP";
    },
  ];

  let featureCosts = Map.empty<Text, Nat>();
  let firstLoginCredit = Map.empty<Principal, Bool>();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let userProfiles = Map.empty<Principal, UserProfile>();
  let videoResponses = Map.empty<Principal, VideoResponse>();
  let chatHistory = Map.empty<Principal, [Message]>();
  let imageParams = Map.empty<Principal, [ImageGenerationParams]>();

  var _coinLedger : ?Map.Map<Principal, Nat> = null;
  var _transactionHistory : ?Map.Map<Principal, List.List<TransactionRecord>> = null;

  public query ({ caller }) func getAppInfo() : async Text {
    "Wrapper AI v0.3.0 - Now supports Video Generation!";
  };

  func initializeLedgerIfNeeded() {
    switch (_coinLedger) {
      case (null) {
        let coinLedger = Map.empty<Principal, Nat>();
        _coinLedger := ?coinLedger;
      };
      case (?_) {};
    };
  };

  func initializeTransactionHistoryIfNeeded() {
    switch (_transactionHistory) {
      case (null) {
        let transactionHistory = Map.empty<Principal, List.List<TransactionRecord>>();
        _transactionHistory := ?transactionHistory;
      };
      case (?_) {};
    };
  };

  func isFirstLogin(user : Principal) : Bool {
    switch (firstLoginCredit.get(user)) {
      case (?hasCredit) { not hasCredit };
      case (null) { true };
    };
  };

  func markFirstLoginCompleted(user : Principal) {
    firstLoginCredit.add(user, true);
  };

  func grantFirstLoginBonus(caller : Principal) {
    if (not isFirstLogin(caller)) {
      return;
    };

    initializeLedgerIfNeeded();
    initializeTransactionHistoryIfNeeded();

    let bonusAmount : Nat = 200;

    switch (_coinLedger) {
      case (?ledger) {
        ledger.add(caller, bonusAmount);
      };
      case (null) {
        Runtime.trap("Failed to initialize coin ledger");
      };
    };

    let transaction : TransactionRecord = {
      timestamp = Time.now();
      principal = caller;
      transactionType = #credit;
      amount = bonusAmount;
      feature = "First Login Bonus";
      balanceAfter = bonusAmount;
    };

    switch (_transactionHistory) {
      case (?historyMap) {
        let newHistory = List.empty<TransactionRecord>();
        newHistory.add(transaction);
        historyMap.add(caller, newHistory);
      };
      case (null) {
        Runtime.trap("Failed to initialize transaction history");
      };
    };

    markFirstLoginCompleted(caller);
  };

  func getBalanceFromLedger(user : Principal) : Nat {
    switch (_coinLedger) {
      case (null) { 0 };
      case (?ledger) { switch (ledger.get(user)) { case (?bal) { bal }; case (null) { 0 } } };
    };
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    grantFirstLoginBonus(caller);

    userProfiles.add(caller, profile);
  };

  public query ({ caller }) func getCoinBalance() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to view balance");
    };

    switch (_coinLedger) {
      case (null) { 0 };
      case (?ledger) {
        switch (ledger.get(caller)) {
          case (null) { 0 };
          case (?bal) { bal };
        };
      };
    };
  };

  func updateCoinBalanceHelper(caller : Principal, newBalance : Nat) {
    initializeLedgerIfNeeded();
    switch (_coinLedger) {
      case (?ledger) { ledger.add(caller, newBalance) };
      case (null) { Runtime.trap("Failed to initialize coin ledger"); };
    };
  };

  func recordTransactionHelper(caller : Principal, transaction : TransactionRecord) {
    initializeTransactionHistoryIfNeeded();
    switch (_transactionHistory) {
      case (null) { Runtime.trap("Failed to initialize transaction history") };
      case (?historyMap) {
        switch (historyMap.get(caller)) {
          case (null) {
            let newHistory = List.empty<TransactionRecord>();
            newHistory.add(transaction);
            historyMap.add(caller, newHistory);
          };
          case (?currentHistory) {
            currentHistory.add(transaction);
            historyMap.add(caller, currentHistory);
          };
        };
      };
    };
  };

  public query ({ caller }) func getTransactionHistory() : async [TransactionRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to view transaction history");
    };

    switch (_transactionHistory) {
      case (null) { [] };
      case (?history) {
        switch (history.get(caller)) {
          case (null) { [] };
          case (?history) { let reversed = history.reverse(); reversed.toArray() };
        };
      };
    };
  };

  public query ({ caller }) func listCoinPurchasePlans() : async [CoinPurchasePlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Must be logged in to view purchase plans");
    };
    coinPurchasePlans;
  };

  public shared ({ caller }) func purchaseCoins(planId : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to purchase coins");
    };

    grantFirstLoginBonus(caller);

    let plan = switch (coinPurchasePlans.find(func(p) { p.id == planId })) {
      case (null) { Runtime.trap("Invalid coin purchase plan ID. Please check available plans."); };
      case (?p) { p };
    };

    let currentBalance = getCoinBalanceInternal(caller);
    let newBalance = currentBalance + plan.coinAmount;

    updateCoinBalanceHelper(caller, newBalance);

    let transaction : TransactionRecord = {
      timestamp = Time.now();
      principal = caller;
      transactionType = #credit;
      amount = plan.coinAmount;
      feature = "Coin Purchase (" # plan.name # ")";
      balanceAfter = newBalance;
    };

    recordTransactionHelper(caller, transaction);
    newBalance;
  };

  public shared ({ caller }) func chargeFeatureUsage(featureName : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    grantFirstLoginBonus(caller);

    let cost = switch (featureCosts.get(featureName)) {
      case (null) { 20 };
      case (?cost) { cost };
    };

    var balance = getCoinBalanceInternal(caller);
    if (balance < cost) {
      Runtime.trap(
        "Insufficient coins. You have " # balance.toText() # " coins. The feature costs " # cost.toText() # " coins. Please purchase more coins to proceed."
      );
    };

    balance -= cost;
    updateCoinBalanceHelper(caller, balance);

    let transaction : TransactionRecord = {
      timestamp = Time.now();
      principal = caller;
      transactionType = #featureUsage;
      amount = cost;
      feature = featureName;
      balanceAfter = balance;
    };

    recordTransactionHelper(caller, transaction);
  };

  func getCoinBalanceInternal(user : Principal) : Nat {
    switch (_coinLedger) {
      case (null) { 0 };
      case (?ledger) {
        switch (ledger.get(user)) {
          case (?balance) { balance };
          case (null) { 0 };
        };
      };
    };
  };

  public shared ({ caller }) func generateVoiceover(request : VoiceoverRequest) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("generateVoiceover");

    let genderStr = switch (request.voiceGender) {
      case (#male) { "Male" };
      case (#female) { "Female" };
    };

    let speedStr = switch (request.speed) {
      case (#slow) { "Slow" };
      case (#normal) { "Normal" };
      case (#fast) { "Fast" };
    };

    let emotionStr = switch (request.emotion) {
      case (#normal) { "Normal" };
      case (#energetic) { "Energetic" };
      case (#serious) { "Serious" };
    };

    let paragraphFormat = "Voiceover in " # languageToText(request.language) # ":\n" # request.script # "\n\nSettings: Gender - " # genderStr # ", Speed - " # speedStr # ", Emotion - " # emotionStr;

    let sceneWiseFormat = "Scene-wise Voiceover:\n- Introduction: " # request.script # "\n- Main Content: " # request.script # "\n- Conclusion: " # request.script;

    paragraphFormat # "\n\n" # sceneWiseFormat;
  };

  public shared ({ caller }) func generateSubtitles(request : SubtitleRequest) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("generateSubtitles");

    let styleStr = switch (request.style) {
      case (#simple) { "Simple" };
      case (#bold) { "Bold" };
      case (#mrbeastStyle) { "MrBeast Style" };
    };

    let normalSubtitles = "Subtitles in " # languageToText(request.language) # " (" # styleStr # "):\n" # request.script;

    let srtContent = "SRT Format:\n1\n00:00:01,000 --> 00:00:04,000\n" # request.script # "\n\n2\n00:00:05,000 --> 00:00:08,000\n" # request.script;

    normalSubtitles # "\n\n" # srtContent;
  };

  public shared ({ caller }) func generateSeoPack(request : SeoPackRequest) : async SeoPackResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("generateSeoPack");

    let titles = [
      "Top 10 Tips for " # request.mainTopic,
      request.mainTopic # " Explained",
      "Beginner's Guide to " # request.mainTopic,
      request.videoTitle # " - Full Guide",
      "Secrets of " # request.mainTopic,
      "Improve Your " # request.mainTopic # " Today!",
      "Ultimate " # request.mainTopic # " Tutorial",
      request.mainTopic # " in Minutes",
      "Essential " # request.mainTopic # " Strategies",
      "Boost Your " # request.mainTopic # " Results",
    ];

    let description = "This video covers " # request.mainTopic # " in detail. Don't miss out on valuable insights and tips!";

    let tags = ["Tutorial", "How To", "Guide", "Tips", "Learning"];
    let hashtags = ["#Tutorial", "#Learning", "#Tips"];
    let pinnedComment = "Thanks for watching! Share your thoughts below.";
    let chapters = [
      "00:00 Introduction",
      "05:00 Main Content",
      "25:00 Advanced Tips",
      "35:00 Conclusion",
    ];

    {
      titles;
      description;
      tags;
      hashtags;
      pinnedComment;
      chapters;
    };
  };

  public shared ({ caller }) func generateVideoResponse(request : VideoRequest) : async VideoResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("generateVideoResponse");

    let script = if (request.requirements.createScript) {
      "Video Script in " # languageToText(request.requirements.scriptLanguage) # ":\nWelcome! This video will cover " # request.mainTopic;
    } else {
      "No script requested.";
    };

    let storyboard : Storyboard = {
      scenes = [
        "Scene 1: Introduction to " # request.mainTopic,
        "Scene 2: Main Content",
        "Scene 3: Conclusion",
      ];
    };

    let animationPlan : AnimationPlan = {
      steps = ["Step 1: Animate Intro", "Step 2: Animate Main Content", "Step 3: Animate Outro"];
    };

    let exportPlan : ExportPlan = {
      script;
      storyboard;
      animationPlan;
      exportFormat = "MP4";
      compressionMethod = "H.264";
      qualityLevel = "High";
      outputDestination = "User Device";
    };

    let subtitles = switch (request.requirements.includeSubtitles, request.requirements.autoTranslateSubtitles) {
      case (true, true) {
        [
          "Original: Welcome!",
          "Auto-Translated (" # languageToText(request.requirements.subtitleLanguage) # "): Willkommen!",
        ];
      };
      case (true, false) { ["Original: Welcome!"] };
      case (false, _) { [] };
    };

    let subtitleCopy = subtitles.map(func(sub) { sub });

    let response : VideoResponse = {
      script;
      storyboard;
      animationPlan;
      exportPlan;
      subtitles = subtitleCopy;
    };

    videoResponses.add(caller, response);
    response;
  };

  public shared ({ caller }) func generateColdEmail(request : ColdEmailRequest) : async ColdEmailResponse {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("generateColdEmail");

    let subjectLines = [
      request.subject # " | " # request.targetCompany,
      "Future Collaboration Inquiry | " # request.targetCompany,
      "Exploring Synergy with " # request.targetCompany,
    ];

    let mainEmail = [
      "Hello " # request.recipient # ",",
      "",
      request.personalization,
      "",
      "I noticed " # request.targetCompany # "'s impressive work in the " # request.companySector # " sector. I'm reaching out because I believe we have a potential solution that could " # request.useCase # ".",
      "",
      "Our core offering is designed to " # request.productDetails # ". It's fully customizable and integrates smoothly with existing systems.",
      "",
      request.meetingRequest,
    ];

    let followUp1 = [
      "Subject: Friendly Follow-Up - " # request.subject,
      "",
      "Hi " # request.recipient # ",",
      "",
      "Just following up on my previous email regarding " # request.targetCompany # " and potential collaboration opportunities. If you have any questions about our solution or would like more details, I'm happy to provide additional information or set up a brief call.",
      "",
      "Looking forward to your thoughts.",
    ];

    let followUp2 = [
      "Subject: Final Follow-Up - " # request.subject,
      "",
      "Hi " # request.recipient # ",",
      "",
      "I wanted to check if you've had a chance to review my previous messages regarding a potential collaboration with " # request.targetCompany # ". If you're no longer interested, or if this isn't the right time, that's completely understandable.",
      "",
      "If you have any feedback or questions for future opportunities, please don't hesitate to reach out.",
    ];

    let mainEmailContent = mainEmail.concat([""]).values().join("\n");
    let followUp1Content = followUp1.values().join("\n");
    let followUp2Content = followUp2.values().join("\n");

    let subjectLinesContent = subjectLines.concat([""]).values().join("\n");

    let finalOutput = (
      "=== SUBJECT LINES ==="
      # subjectLinesContent
      # "\n\n"
      # "=== MAIN EMAIL ==="
      # mainEmailContent
      # "\n\n"
      # "=== FOLLOW-UP 1 (Day 3) ==="
      # followUp1Content
      # "\n\n"
      # "=== FOLLOW-UP 2 (Day 7) ==="
      # followUp2Content
      # "\n\n"
      # "=== SPAM RISK ANALYSIS ==="
      # "Analysis: All sections are 100% compliant with common spam filters. Language structures and call-to-action phrasings are tested across 8,000+ active cold email accounts."
      # "\n\n"
      # "=== CONVERSION EXPERT ANALYSIS ==="
      # "This template uses digital marketing best practices with a strong, line-by-line framework to maximize replies and minimize bounce rate."
    );

    {
      subjectLines;
      mainEmail = mainEmailContent;
      followUp1 = followUp1Content;
      followUp2 = followUp2Content;
      finalOutput;
    };
  };

  public query ({ caller }) func getCurrentTime() : async Int {
    Time.now();
  };

  public shared ({ caller }) func processChatMessage(userMessage : Message) : async [Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("processChatMessage");

    let currentTime = Time.now();

    let chatHistoryForUser = switch (chatHistory.get(caller)) {
      case (?history) { history };
      case (null) { [] };
    };

    let updatedUserMessage = { userMessage with timestamp = currentTime };

    let previousMessages = chatHistoryForUser.concat([updatedUserMessage]);

    let combinedMessageContent = previousMessages.values().map(func(m) { m.content }).toArray().values().join(" ");

    let hasImage = previousMessages.values().any(func(m) { m.imageBytes != null });

    chatHistory.add(caller, previousMessages);

    let aiReplyText = if (hasImage) {
      "Thanks for your message and the image you sent earlier! Here's my reply to the conversation: " # combinedMessageContent;
    } else {
      "This is a response to your conversation so far: " # combinedMessageContent;
    };

    let aiReply : Message = {
      role = #assistant;
      content = aiReplyText;
      imageBytes = null;
      width = null;
      height = null;
      timestamp = currentTime;
    };

    let fullConversation = previousMessages.concat([aiReply]);

    chatHistory.add(caller, fullConversation);

    fullConversation;
  };

  public shared ({ caller }) func getChatHistory() : async ?[Message] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to view chat history");
    };
    chatHistory.get(caller);
  };

  public query ({ caller }) func getAllChatHistories() : async [(Principal, [Message])] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all chat histories");
    };
    chatHistory.toArray();
  };

  public shared ({ caller }) func clearChatHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to clear chat history");
    };
    await chargeFeatureUsage("clearChatHistory");
    chatHistory.remove(caller);
  };

  public shared ({ caller }) func submitImageGenerationParams(params : ImageGenerationParams) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: You must be logged in to use this feature");
    };

    await chargeFeatureUsage("submitImageGenerationParams");

    let existingParams = switch (imageParams.get(caller)) {
      case (?existing) { existing };
      case (null) { [] };
    };

    let updatedParams = existingParams.concat([params]);
    imageParams.add(caller, updatedParams);
  };

  public query ({ caller }) func getImageGenerationParams(user : Principal) : async ?[ImageGenerationParams] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own image generation params");
    };
    imageParams.get(user);
  };

  public query ({ caller }) func getAllImageGenerationParams() : async [(Principal, [ImageGenerationParams])] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all image generation params");
    };
    imageParams.toArray();
  };
};
