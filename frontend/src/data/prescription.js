export const prescriptionData = {
  mastitis: {
    diseaseName: { en: "Mastitis", hi: "थनैला रोग" },
    overview: {
      en: "Inflammation of the udder tissue, usually due to bacterial infection",
      hi: "थन ऊतक की सूजन, आमतौर पर बैक्टीरियल संक्रमण के कारण",
    },
    symptoms: {
      en: [
        "Udder swelling and redness",
        "Milk with clots, flakes, or watery consistency",
        "Udder feels hot and painful",
        "Fever and loss of appetite",
        "Reduced milk production",
      ],
      hi: [
        "थन में सूजन और लाली",
        "दूध में थक्के, गुच्छे या पानी जैसा",
        "थन गर्म और दर्दनाक लगता है",
        "बुखार और भूख में कमी",
        "दूध उत्पादन में कमी",
      ],
    },
    causes: {
      en: [
        "Bacterial infection (E. coli, Staphylococcus, Streptococcus)",
        "Poor milking hygiene",
        "Injuries to the teat or udder",
        "Contaminated bedding or environment",
        "Poor sanitation in milking equipment",
      ],
      hi: [
        "बैक्टीरियल संक्रमण (ई. कोलाई, स्टैफिलोकोकस, स्ट्रेप्टोकोकस)",
        "खराब दुहाई स्वच्छता",
        "थन या ऊदर में चोट",
        "दूषित बिस्तर या वातावरण",
        "दुहाई उपकरण में खराब स्वच्छता",
      ],
    },
    treatment: {
      en: [
        "Antibiotic therapy (intramammary antibiotics prescribed by vet)",
        "Anti-inflammatory drugs (Meloxicam, Flunixin)",
        "Frequent milking to remove infected milk",
        "Udder massage with warm compresses",
        "Isolate affected animal from herd",
      ],
      hi: [
        "एंटीबायोटिक थेरेपी (पशु चिकित्सक द्वारा निर्धारित इंट्रामैमरी एंटीबायोटिक्स)",
        "सूजनरोधी दवाएं (मेलोक्सिकैम, फ्लूनिक्सिन)",
        "संक्रमित दूध निकालने के लिए बार-बार दुहना",
        "गर्म सेक के साथ थन की मालिश",
        "प्रभावित जानवर को झुंड से अलग करें",
      ],
    },
    prevention: {
      en: [
        "Maintain clean and dry bedding",
        "Proper milking machine maintenance and sanitation",
        "Teat dipping after milking with antiseptic solution",
        "Regular udder health checks",
        "Adequate nutrition and clean water",
      ],
      hi: [
        "साफ और सूखा बिस्तर बनाए रखें",
        "उचित दुहाई मशीन रखरखाव और स्वच्छता",
        "दुहाई के बाद एंटीसेप्टिक घोल से थन डिपिंग",
        "नियमित थन स्वास्थ्य जांच",
        "पर्याप्त पोषण और साफ पानी",
      ],
    },
    recoveryTime: {
      en: "7-14 days with proper treatment",
      hi: "उचित उपचार के साथ 7-14 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Seek immediate veterinary help if high fever, severe swelling, or septic shock symptoms appear",
      hi: "यदि तेज बुखार, गंभीर सूजन या सेप्टिक शॉक के लक्षण दिखें तो तुरंत पशु चिकित्सक से मदद लें",
    },
  },

  blackleg: {
    diseaseName: {
      en: "Blackleg",
      hi: "ब्लैकलेग रोग",
    },
    overview: {
      en: "A severe bacterial infection caused by Clostridium chauvoei, leading to muscle damage and sudden death",
      hi: "क्लोस्ट्रीडियम चौवेई से होने वाला गंभीर बैक्टीरियल संक्रमण, जो मांसपेशियों को नुकसान और अचानक मृत्यु का कारण बनता है",
    },
    symptoms: {
      en: [
        "Sudden lameness",
        "Swollen muscles producing crackling sound",
        "High fever",
        "Loss of appetite",
        "Rapid breathing",
        "Sudden death within hours",
      ],
      hi: [
        "अचानक लंगड़ापन",
        "सूजी हुई मांसपेशियों से खड़खड़ाहट की आवाज",
        "तेज़ बुखार",
        "भूख का कम होना",
        "तेज़ सांसें",
        "कुछ घंटों में अचानक मृत्यु",
      ],
    },
    causes: {
      en: [
        "Clostridium chauvoei bacteria in soil",
        "Contaminated wounds",
        "Grazing on infected pasture",
        "Muscle injury activating dormant spores",
      ],
      hi: [
        "मिट्टी में क्लोस्ट्रीडियम चौवेई बैक्टीरिया",
        "संक्रमित घाव",
        "संक्रमित चरागाह पर चरना",
        "मांसपेशियों में चोट से सुप्त बीजाणु सक्रिय होना",
      ],
    },
    treatment: {
      en: [
        "High-dose penicillin (as prescribed by vet)",
        "Anti-inflammatory medications",
        "Supportive care and fluids",
      ],
      hi: [
        "उच्च मात्रा में पेनिसिलिन (पशु चिकित्सक द्वारा निर्धारित)",
        "सूजनरोधी दवाएं",
        "सहायक देखभाल और तरल पदार्थ",
      ],
    },
    prevention: {
      en: [
        "Annual vaccination",
        "Proper wound care",
        "Avoid grazing in high-risk areas",
        "Good hygiene in housing",
      ],
      hi: [
        "वार्षिक टीकाकरण",
        "घावों की उचित देखभाल",
        "उच्च जोखिम वाले क्षेत्रों में चराई से बचें",
        "आवास में अच्छी स्वच्छता",
      ],
    },
    recoveryTime: {
      en: "Recovery is rare if symptoms appear",
      hi: "लक्षण आने के बाद रिकवरी दुर्लभ होती है",
    },
    severity: "Very High",
    veterinarianRequired: true,
    emergency: {
      en: "Immediate veterinary intervention is required due to high mortality risk",
      hi: "उच्च मृत्यु जोखिम के कारण तुरंत पशु चिकित्सा हस्तक्षेप आवश्यक",
    },
  },

  bloat: {
    diseaseName: {
      en: "Bloat",
      hi: "अपच / फूला हुआ पेट",
    },
    overview: {
      en: "A condition where gas builds up in the rumen, causing swelling and difficulty breathing",
      hi: "एक स्थिति जिसमें रूमेन में गैस जमा हो जाती है, जिससे सूजन और सांस लेने में कठिनाई होती है",
    },
    symptoms: {
      en: [
        "Left abdomen swelling",
        "Restlessness",
        "Difficulty breathing",
        "Reduced appetite",
        "Animal unable to burp",
      ],
      hi: [
        "बाईं तरफ पेट फूलना",
        "बेचैनी",
        "सांस लेने में कठिनाई",
        "भूख कम होना",
        "डकार न लेना",
      ],
    },
    causes: {
      en: [
        "High-grain diet",
        "Excess legumes (alfalfa, clover)",
        "Choking that blocks gas escape",
        "Sudden diet change",
      ],
      hi: [
        "अधिक अनाज वाला आहार",
        "अधिक दालें (अल्फाल्फा, क्लोवर)",
        "अवरोध जिससे गैस बाहर नहीं निकलती",
        "आहार में अचानक बदलाव",
      ],
    },
    treatment: {
      en: [
        "Passing a stomach tube",
        "Anti-foaming agents (poloxalene)",
        "Trocar puncture in emergency (vet only)",
        "Walking the animal to stimulate rumen movement",
      ],
      hi: [
        "स्टमक ट्यूब डालना",
        "एंटी-फोमिंग दवाएं (पोलोक्सालेन)",
        "आपात स्थिति में ट्रोकार पंचर (सिर्फ पशु चिकित्सक)",
        "रूमेन गतिविधि बढ़ाने के लिए जानवर को चलाना",
      ],
    },
    prevention: {
      en: [
        "Avoid sudden diet changes",
        "Provide roughage before high-grain feed",
        "Use bloat-preventing supplements",
        "Do not allow hungry animals to graze lush pasture",
      ],
      hi: [
        "आहार में अचानक बदलाव से बचें",
        "उच्च अनाज देने से पहले रफ़ेज़ दें",
        "फूलने से रोकने वाले सप्लीमेंट दें",
        "भूखे जानवरों को हरे-भरे चरागाह में न छोड़ें",
      ],
    },
    recoveryTime: {
      en: "Few hours to 1 day if treated early",
      hi: "समय पर उपचार होने पर कुछ घंटे से 1 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Severe bloat can cause death within hours; immediate veterinary care needed",
      hi: "गंभीर फुलावट कुछ घंटों में मृत्यु का कारण बन सकती है; तुरंत पशु चिकित्सा आवश्यक",
    },
  },

  coccidiosis: {
    diseaseName: {
      en: "Coccidiosis",
      hi: "कॉकसीडियोसिस",
    },
    overview: {
      en: "A parasitic disease caused by coccidia affecting the intestinal lining",
      hi: "कॉकसिडिया परजीवी द्वारा आंतों की परत को प्रभावित करने वाला रोग",
    },
    symptoms: {
      en: [
        "Diarrhoea (sometimes bloody)",
        "Weight loss",
        "Dehydration",
        "Poor growth in calves",
        "Rough coat",
      ],
      hi: [
        "दस्त (कभी-कभी खून के साथ)",
        "वज़न कम होना",
        "डिहाइड्रेशन",
        "बछड़ों में कम वृद्धि",
        "खुरदुरा बाल",
      ],
    },
    causes: {
      en: [
        "Coccidia parasite contamination",
        "Dirty housing",
        "Overcrowding",
        "Stress and poor nutrition",
      ],
      hi: [
        "कॉकसिडिया परजीवी संक्रमण",
        "गंदा आवास",
        "अधिक भीड़",
        "तनाव और खराब पोषण",
      ],
    },
    treatment: {
      en: [
        "Anticoccidial drugs such as Sulfonamides",
        "Electrolytes for dehydration",
        "Improved hygiene and sanitation",
      ],
      hi: [
        "एंटी-कॉकसिडियल दवाएं जैसे सल्फोनामाइड्स",
        "डिहाइड्रेशन के लिए इलेक्ट्रोलाइट्स",
        "स्वच्छता में सुधार",
      ],
    },
    prevention: {
      en: [
        "Maintain clean pens",
        "Avoid overcrowding",
        "Use anticoccidial feed additives",
        "Regular disinfection",
      ],
      hi: [
        "कलमों को साफ रखें",
        "भीड से बचें",
        "एंटी-कॉकसिडियल फीड एडिटिव्स का उपयोग",
        "नियमित कीटाणुशोधन",
      ],
    },
    recoveryTime: {
      en: "5–7 days with proper treatment",
      hi: "उचित उपचार से 5–7 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Bloody diarrhoea or severe dehydration requires urgent vet attention",
      hi: "खूनी दस्त या गंभीर निर्जलीकरण पर तुरंत पशु चिकित्सक की आवश्यकता",
    },
  },

  cryptosporidiosis: {
    diseaseName: {
      en: "Cryptosporidiosis",
      hi: "क्रिप्टोस्पोरिडियोसिस",
    },
    overview: {
      en: "A protozoan parasite infection mainly causing diarrhoea in young calves",
      hi: "एक प्रोटोजोआ परजीवी संक्रमण जो मुख्य रूप से छोटे बछड़ों में दस्त का कारण बनता है",
    },
    symptoms: {
      en: [
        "Watery diarrhoea",
        "Dehydration",
        "Weakness",
        "Loss of appetite",
        "Poor weight gain",
      ],
      hi: [
        "पानी जैसा दस्त",
        "डिहाइड्रेशन",
        "कमजोरी",
        "भूख की कमी",
        "वजन बढ़ने में कमी",
      ],
    },
    causes: {
      en: [
        "Cryptosporidium parvum parasite",
        "Contaminated feed or water",
        "Unsanitary housing",
        "High-density calf housing",
      ],
      hi: [
        "क्रिप्टोस्पोरिडियम पार्वम परजीवी",
        "संक्रमित चारा या पानी",
        "गंदे आवास",
        "अधिक भीड़ वाले बछड़ा शेड",
      ],
    },
    treatment: {
      en: [
        "Electrolyte therapy",
        "Halofuginone (as prescribed)",
        "Supportive fluids",
        "Good hygiene",
      ],
      hi: [
        "इलेक्ट्रोलाइट थेरेपी",
        "हैलोफ्युजिनोन (निर्धारित अनुसार)",
        "सहायक तरल",
        "अच्छी स्वच्छता",
      ],
    },
    prevention: {
      en: [
        "Clean calf pens daily",
        "Provide clean drinking water",
        "Disinfect surfaces properly",
        "Avoid overcrowding",
      ],
      hi: [
        "बछड़ा कलम की दैनिक सफाई",
        "साफ पानी उपलब्ध कराना",
        "सतहों को सही तरीके से कीटाणुरहित करना",
        "भीड़ से बचना",
      ],
    },
    recoveryTime: {
      en: "4–10 days depending on severity",
      hi: "गंभीरता अनुसार 4–10 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Severe dehydration needs immediate veterinary treatment",
      hi: "गंभीर निर्जलीकरण पर तुरंत पशु चिकित्सा आवश्यक",
    },
  },

  displaced_abomasum: {
    diseaseName: {
      en: "Displaced Abomasum (DA)",
      hi: "अबोमेसम विस्थापन",
    },
    overview: {
      en: "A condition where the abomasum shifts from its normal position, commonly after calving",
      hi: "एक स्थिति जिसमें अबोमेसम अपनी सामान्य स्थिति से खिसक जाता है, आमतौर पर बछड़ा देने के बाद",
    },
    symptoms: {
      en: [
        "Reduced appetite",
        "Drop in milk production",
        "Weakness",
        "Dehydration",
        "Characteristic 'ping' sound on vet examination",
      ],
      hi: [
        "भूख कम होना",
        "दूध उत्पादन में कमी",
        "कमजोरी",
        "डिहाइड्रेशन",
        "परीक्षण के दौरान 'पिंग' की आवाज",
      ],
    },
    causes: {
      en: [
        "High-concentrate feeding",
        "Sudden diet changes",
        "Low rumen motility",
        "Post-calving metabolic issues",
      ],
      hi: [
        "उच्च अनाज आधारित आहार",
        "आहार में अचानक परिवर्तन",
        "रूमेन की कम गति",
        "बछड़ा देने के बाद चयापचय समस्याएं",
      ],
    },
    treatment: {
      en: [
        "Surgical correction",
        "Rolling technique (temporary relief)",
        "IV fluids",
        "Correcting diet imbalance",
      ],
      hi: [
        "शल्य चिकित्सा द्वारा सुधार",
        "रोलिंग तकनीक (अस्थायी राहत)",
        "IV तरल",
        "आहार असंतुलन सुधार",
      ],
    },
    prevention: {
      en: [
        "Balanced diet around calving",
        "High-fiber feeding",
        "Avoid sudden feed changes",
        "Proper management of transition cows",
      ],
      hi: [
        "बछड़ा देने के समय संतुलित आहार",
        "उच्च फाइबर वाला चारा",
        "आहार में अचानक बदलाव से बचें",
        "ट्रांज़िशन गायों का सही प्रबंधन",
      ],
    },
    recoveryTime: {
      en: "3–10 days after treatment",
      hi: "उपचार के बाद 3–10 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Left or right displaced abomasum requires urgent surgery",
      hi: "बाएं या दाएं अबोमेसम विस्थापन में तुरंत सर्जरी आवश्यक",
    },
  },

  gut_worms: {
    diseaseName: {
      en: "Gut Worms",
      hi: "आंतों के कीड़े",
    },
    overview: {
      en: "Parasitic worms such as roundworms and tapeworms that infect the digestive tract",
      hi: "राउंडवर्म और टेपवर्म जैसे परजीवी कीड़े जो पाचन तंत्र को संक्रमित करते हैं",
    },
    symptoms: {
      en: [
        "Weight loss",
        "Poor appetite",
        "Diarrhoea",
        "Rough coat",
        "Reduced growth in calves",
      ],
      hi: [
        "वजन कम होना",
        "भूख कम लगना",
        "दस्त",
        "बाल खुरदरे होना",
        "बछड़ों में धीमी वृद्धि",
      ],
    },
    causes: {
      en: [
        "Contaminated pasture",
        "Poor hygiene in housing",
        "Infrequent deworming",
        "Overcrowding",
      ],
      hi: [
        "संक्रमित चरागाह",
        "गंदा आवास",
        "कम बार डी-वर्मिंग करना",
        "अधिक भीड़",
      ],
    },
    treatment: {
      en: [
        "Anthelmintic (deworming) medicines such as Albendazole, Ivermectin",
        "Improved nutrition",
        "Clean drinking water",
      ],
      hi: [
        "डी-वर्मिंग दवाएं जैसे अल्बेंडाज़ोल, आइवरमेक्टिन",
        "पोषण में सुधार",
        "साफ पानी",
      ],
    },
    prevention: {
      en: [
        "Regular deworming schedule",
        "Pasture rotation",
        "Clean housing and feeders",
        "Avoid overcrowding",
      ],
      hi: [
        "नियमित डी-वर्मिंग",
        "चरागाह बदलकर चराना",
        "आवास और फीडर साफ रखें",
        "भीड़ से बचें",
      ],
    },
    recoveryTime: {
      en: "3–7 days after deworming",
      hi: "डी-वर्मिंग के बाद 3–7 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Severe worm load causing anaemia or collapse needs urgent vet care",
      hi: "गंभीर कीड़े का भार जिससे एनीमिया या गिरावट हो, तुरंत पशु चिकित्सा की आवश्यकता",
    },
  },

  listeriosis: {
    diseaseName: {
      en: "Listeriosis",
      hi: "लिस्टेरियोसिस",
    },
    overview: {
      en: "A bacterial infection caused by Listeria monocytogenes affecting the brain and digestive system",
      hi: "लिस्टरिया मोनोसाइटोजेन्स बैक्टीरिया से होने वाला संक्रमण जो दिमाग और पाचन तंत्र को प्रभावित करता है",
    },
    symptoms: {
      en: [
        "Circling behaviour",
        "Head tilt",
        "Drooling",
        "Lack of coordination",
        "Fever",
      ],
      hi: [
        "घूमते रहना",
        "सिर एक तरफ झुकना",
        "लार टपकना",
        "संतुलन बिगड़ना",
        "बुखार",
      ],
    },
    causes: {
      en: [
        "Spoiled silage",
        "Contaminated feed",
        "Poor hygiene",
        "Stress and weakened immunity",
      ],
      hi: [
        "खराब या सड़ी हुई साइलेंज",
        "संक्रमित चारा",
        "खराब स्वच्छता",
        "तनाव और कमजोर प्रतिरक्षा",
      ],
    },
    treatment: {
      en: [
        "High-dose antibiotics (Penicillin, Oxytetracycline)",
        "Fluid therapy",
        "Anti-inflammatory drugs",
      ],
      hi: [
        "उच्च मात्रा में एंटीबायोटिक्स (पेनिसिलिन, ऑक्सीटेट्रासाइक्लिन)",
        "तरल थेरेपी",
        "सूजनरोधी दवाएं",
      ],
    },
    prevention: {
      en: [
        "Use high-quality silage",
        "Avoid feeding spoiled fodder",
        "Ensure clean housing",
        "Proper feed storage",
      ],
      hi: [
        "उच्च गुणवत्ता वाली साइलेंज का उपयोग",
        "सड़ा-गला चारा न खिलाएं",
        "आवास साफ रखें",
        "चारे का सही भंडारण",
      ],
    },
    recoveryTime: {
      en: "7–14 days with early treatment",
      hi: "समय पर उपचार से 7–14 दिन",
    },
    severity: "Very High",
    veterinarianRequired: true,
    emergency: {
      en: "Neurological symptoms require immediate vet attention",
      hi: "तंत्रिका संबंधी लक्षणों पर तुरंत पशु चिकित्सक की आवश्यकता",
    },
  },

  liver_fluke: {
    diseaseName: {
      en: "Liver Fluke",
      hi: "लीवर फ्लूक",
    },
    overview: {
      en: "A parasitic infection caused by Fasciola species affecting the liver and bile ducts",
      hi: "फैशिओला प्रजाति के परजीवी से होने वाला संक्रमण जो लीवर और बाइल डक्ट को प्रभावित करता है",
    },
    symptoms: {
      en: [
        "Weight loss",
        "Anaemia",
        "Swollen abdomen",
        "Diarrhoea",
        "Reduced milk production",
      ],
      hi: [
        "वजन कम होना",
        "एनीमिया",
        "पेट का फूलना",
        "दस्त",
        "दूध उत्पादन में कमी",
      ],
    },
    causes: {
      en: [
        "Presence of fluke larvae in wet grazing areas",
        "Contaminated water",
        "Poor pasture management",
      ],
      hi: [
        "गीले चरागाह क्षेत्रों में फ्लूक लार्वा की उपस्थिति",
        "संक्रमित पानी",
        "चरागाह प्रबंधन में कमी",
      ],
    },
    treatment: {
      en: [
        "Flukicides such as Triclabendazole",
        "Supportive nutrition",
        "Clean water supply",
      ],
      hi: [
        "फ्लूकिसाइड दवाएं जैसे ट्राइक्लाबेंडाज़ोल",
        "पोषण में सुधार",
        "साफ पानी की आपूर्ति",
      ],
    },
    prevention: {
      en: [
        "Avoid grazing in swampy areas",
        "Regular fluke treatment",
        "Improve drainage in pastures",
        "Clean drinking water",
      ],
      hi: [
        "दलदली क्षेत्रों में चराई से बचें",
        "नियमित फ्लूक उपचार",
        "चरागाह में ड्रेनेज सुधारें",
        "साफ पानी दें",
      ],
    },
    recoveryTime: {
      en: "2–4 weeks depending on severity",
      hi: "गंभीरता के अनुसार 2–4 सप्ताह",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Severe anaemia or weakness requires urgent vet support",
      hi: "गंभीर एनीमिया या कमजोरी पर तुरंत पशु चिकित्सा सहायता आवश्यक",
    },
  },

  necrotic_enteritis: {
    diseaseName: {
      en: "Necrotic Enteritis",
      hi: "नेक्रोटिक एंटेराइटिस",
    },
    overview: {
      en: "A severe intestinal infection caused by toxins produced by Clostridium perfringens",
      hi: "क्लोस्ट्रीडियम पर्फ्रिंजेंस द्वारा उत्पन्न विषाक्त पदार्थों से होने वाला गंभीर आंत संक्रमण",
    },
    symptoms: {
      en: [
        "Foul-smelling diarrhoea",
        "Sudden weakness",
        "Bloody stools",
        "Dehydration",
        "Loss of appetite",
      ],
      hi: [
        "बदबूदार दस्त",
        "अचानक कमजोरी",
        "खूनी मल",
        "डिहाइड्रेशन",
        "भूख कम होना",
      ],
    },
    causes: {
      en: [
        "Overgrowth of Clostridium bacteria",
        "Sudden feed change",
        "High-grain diet",
        "Poor hygiene",
      ],
      hi: [
        "क्लोस्ट्रीडियम बैक्टीरिया की अत्यधिक वृद्धि",
        "आहार में अचानक बदलाव",
        "उच्च अनाज वाला आहार",
        "खराब स्वच्छता",
      ],
    },
    treatment: {
      en: [
        "Antibiotics such as Penicillin or Ampicillin",
        "IV fluids for dehydration",
        "Electrolytes",
        "Probiotics for gut recovery",
      ],
      hi: [
        "एंटीबायोटिक्स जैसे पेनिसिलिन या एम्पिसिलिन",
        "डिहाइड्रेशन के लिए IV तरल",
        "इलेक्ट्रोलाइट्स",
        "आंत सुधार के लिए प्रोबायोटिक्स",
      ],
    },
    prevention: {
      en: [
        "Maintain feed hygiene",
        "Avoid sudden diet changes",
        "Reduce high-grain feeding",
        "Use probiotics regularly",
      ],
      hi: [
        "चारे की स्वच्छता बनाए रखें",
        "आहार में अचानक बदलाव से बचें",
        "अधिक अनाज खिलाने से बचें",
        "नियमित प्रोबायोटिक्स दें",
      ],
    },
    recoveryTime: {
      en: "5–10 days with treatment",
      hi: "उपचार के साथ 5–10 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Bloody diarrhoea or collapse requires urgent veterinary care",
      hi: "खूनी दस्त या गिरावट पर तुरंत पशु चिकित्सा सहायता आवश्यक",
    },
  },

  peri_weaning_diarrhoea: {
    diseaseName: {
      en: "Peri-Weaning Diarrhoea",
      hi: "छुट्टा होने के समय दस्त",
    },
    overview: {
      en: "A condition causing diarrhoea in calves around the time of weaning due to stress and dietary changes",
      hi: "बछड़ों में छुट्टा करने के समय तनाव और आहार बदलाव के कारण होने वाला दस्त",
    },
    symptoms: {
      en: [
        "Watery diarrhoea",
        "Dehydration",
        "Weight loss",
        "Reduced feed intake",
        "Weakness",
      ],
      hi: [
        "पानी जैसा दस्त",
        "डिहाइड्रेशन",
        "वजन कम होना",
        "चारा कम खाना",
        "कमजोरी",
      ],
    },
    causes: {
      en: [
        "Sudden separation stress",
        "Change in feed type",
        "Poor housing hygiene",
        "Viral or bacterial secondary infections",
      ],
      hi: [
        "अचानक मां से अलग करने का तनाव",
        "चारे में बदलाव",
        "गंदा आवास",
        "वायरल या बैक्टीरियल द्वितीयक संक्रमण",
      ],
    },
    treatment: {
      en: [
        "Electrolytes for rehydration",
        "Anti-diarrhoeal medication",
        "Probiotics",
        "Nutritional support",
      ],
      hi: [
        "रीहाइड्रेशन के लिए इलेक्ट्रोलाइट्स",
        "दस्त रोकने वाली दवाएं",
        "प्रोबायोटिक्स",
        "पोषण समर्थन",
      ],
    },
    prevention: {
      en: [
        "Gradual weaning process",
        "Clean housing",
        "Reduce stress during weaning",
        "Balanced nutrition",
      ],
      hi: [
        "धीरे-धीरे छुट्टा करने की प्रक्रिया",
        "साफ आवास",
        "छुट्टा करते समय तनाव कम करें",
        "संतुलित पोषण",
      ],
    },
    recoveryTime: {
      en: "3–7 days with treatment",
      hi: "उपचार के साथ 3–7 दिन",
    },
    severity: "Medium",
    veterinarianRequired: false,
    emergency: {
      en: "Severe dehydration requires vet support",
      hi: "गंभीर डिहाइड्रेशन पर पशु चिकित्सक आवश्यक",
    },
  },
  rift_valley_fever: {
    diseaseName: { en: "Rift Valley Fever", hi: "रिफ्ट वैली बुखार" },
    overview: {
      en: "A viral disease transmitted by mosquitoes, causing fever, liver damage, and high mortality in young animals.",
      hi: "मच्छरों द्वारा फैलने वाला वायरल रोग, जो बुखार, लीवर क्षति और युवा पशुओं में उच्च मृत्यु दर का कारण बनता है।",
    },
    symptoms: {
      en: [
        "High fever",
        "Nasal discharge",
        "Vomiting and diarrhea",
        "Sudden death in calves",
        "Abortion in pregnant animals"
      ],
      hi: [
        "तेज बुखार",
        "नाक से स्राव",
        "उल्टी और दस्त",
        "बछड़ों में अचानक मौत",
        "गर्भवती पशुओं में गर्भपात"
      ],
    },
    causes: {
      en: [
        "Mosquito-borne virus infection",
        "Contact with infected blood or tissues",
        "Contaminated water sources"
      ],
      hi: [
        "मच्छरों द्वारा फैलने वाला वायरल संक्रमण",
        "संक्रमित खून या ऊतकों के संपर्क में आना",
        "दूषित पानी के स्रोत"
      ],
    },
    treatment: {
      en: [
        "Supportive care (fluids, electrolytes)",
        "Anti-inflammatory medications",
        "Vector control to reduce spread"
      ],
      hi: [
        "सहायक देखभाल (तरल पदार्थ, इलेक्ट्रोलाइट्स)",
        "सूजनरोधी दवाएं",
        "प्रसार रोकने के लिए मच्छर नियंत्रण"
      ],
    },
    prevention: {
      en: [
        "Vaccination in endemic areas",
        "Mosquito control programs",
        "Proper disposal of infected carcasses"
      ],
      hi: [
        "स्थानिक क्षेत्रों में टीकाकरण",
        "मच्छर नियंत्रण कार्यक्रम",
        "संक्रमित शवों का उचित निपटान"
      ],
    },
    recoveryTime: {
      en: "5–14 days depending on severity",
      hi: "तीव्रता के आधार पर 5–14 दिन",
    },
    severity: "Very High",
    veterinarianRequired: true,
    emergency: {
      en: "Immediately contact a veterinarian if sudden deaths or abortions occur.",
      hi: "यदि अचानक मौतें या गर्भपात हों तो तुरंत पशु चिकित्सक से संपर्क करें।",
    },
  },

  rumen_acidosis: {
    diseaseName: { en: "Rumen Acidosis", hi: "र्यूमेन एसिडोसिस" },
    overview: {
      en: "A digestive disorder caused by excessive intake of carbohydrates, leading to increased rumen acidity.",
      hi: "अधिक कार्बोहाइड्रेट सेवन से होने वाला पाचन विकार, जिसमें र्यूमेन में अम्लता बढ़ जाती है।",
    },
    symptoms: {
      en: [
        "Loss of appetite",
        "Diarrhea with sour smell",
        "Lethargy",
        "Dehydration",
        "Reduced milk production"
      ],
      hi: [
        "भूख में कमी",
        "खट्टे गंध वाला दस्त",
        "सुस्ती",
        "निर्जलीकरण",
        "दूध उत्पादन में कमी"
      ],
    },
    causes: {
      en: [
        "Sudden high-grain diet",
        "Overfeeding of concentrates",
        "Poor fiber intake"
      ],
      hi: [
        "अचानक उच्च-अनाज आहार देना",
        "कंसंट्रेट का अधिक सेवन",
        "कम फाइबर वाला भोजन"
      ],
    },
    treatment: {
      en: [
        "IV fluids and electrolytes",
        "Antacids like magnesium oxide",
        "Rumen buffer therapy",
        "Feeding high-fiber diet"
      ],
      hi: [
        "IV तरल और इलेक्ट्रोलाइट्स",
        "मैग्नीशियम ऑक्साइड जैसे एंटासिड",
        "र्यूमेन बफर थेरेपी",
        "उच्च फाइबर वाला भोजन"
      ],
    },
    prevention: {
      en: [
        "Gradual diet changes",
        "Balanced fiber-to-grain ratio",
        "Avoid sudden feeding of concentrates"
      ],
      hi: [
        "धीरे-धीरे आहार परिवर्तन",
        "फाइबर और अनाज का संतुलित अनुपात",
        "कंसंट्रेट अचानक न दें"
      ],
    },
    recoveryTime: {
      en: "2–5 days with early treatment",
      hi: "शीघ्र उपचार के साथ 2–5 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Seek urgent veterinary care if cow becomes unable to stand.",
      hi: "यदि गाय खड़े होने में असमर्थ हो जाए तो तुरंत पशु चिकित्सा सहायता लें।",
    },
  },

  traumatic_reticulitis: {
    diseaseName: { en: "Traumatic Reticulitis", hi: "आघातजनित रेटिकुलाइटिस (हार्डवेयर रोग)" },
    overview: {
      en: "Caused when cattle ingest sharp objects that puncture the reticulum, leading to pain and infection.",
      hi: "जब पशु तेज धातु वस्तुएं निगल लेते हैं जो रेटिकुलम में छेद कर देती हैं, तब यह दर्द और संक्रमण का कारण बनता है।",
    },
    symptoms: {
      en: [
        "Sudden drop in feed intake",
        "Arched back posture",
        "Pain while walking",
        "Reduced rumen movement",
        "Fever"
      ],
      hi: [
        "भोजन कम खाना",
        "पीठ मोड़कर खड़ा होना",
        "चलते समय दर्द",
        "र्यूमेन की गति कम होना",
        "बुखार"
      ],
    },
    causes: {
      en: [
        "Ingestion of metals like nails or wires",
        "Contaminated feed or grazing areas"
      ],
      hi: [
        "किल, तार जैसी धातु वस्तुओं का निगलना",
        "दूषित चारा या चराई क्षेत्र"
      ],
    },
    treatment: {
      en: [
        "Magnet therapy",
        "Antibiotics",
        "Complete stall rest",
        "Surgery in severe cases"
      ],
      hi: [
        "मैग्नेट थेरेपी",
        "एंटीबायोटिक्स",
        "पूरा आराम",
        "गंभीर मामलों में सर्जरी"
      ],
    },
    prevention: {
      en: [
        "Use rumen magnets",
        "Keep feed areas metal-free",
        "Regular cleaning of barns"
      ],
      hi: [
        "र्यूमेन मैग्नेट का उपयोग",
        "चारा क्षेत्र में धातु न होने दें",
        "खलिहान की नियमित सफाई"
      ],
    },
    recoveryTime: {
      en: "7–21 days",
      hi: "7–21 दिन",
    },
    severity: "Very High",
    veterinarianRequired: true,
    emergency: {
      en: "Call a vet immediately if animal shows severe abdominal pain.",
      hi: "यदि पशु को तेज पेट दर्द हो तो तुरंत पशु चिकित्सक को बुलाएं।",
    },
  },

  calf_diphtheria: {
    diseaseName: { en: "Calf Diphtheria", hi: "बछड़ा डिफ्थीरिया" },
    overview: {
      en: "A bacterial throat infection in calves causing swelling and difficulty breathing.",
      hi: "बछड़ों में गले का बैक्टीरियल संक्रमण जो सूजन और सांस लेने में कठिनाई पैदा करता है।",
    },
    symptoms: {
      en: [
        "Difficulty breathing",
        "Severe cough",
        "Swollen throat",
        "Foul-smelling mouth",
        "Weakness"
      ],
      hi: [
        "सांस लेने में कठिनाई",
        "तेज़ खांसी",
        "गला सूज जाना",
        "मुंह से बदबू",
        "कमज़ोरी"
      ],
    },
    causes: {
      en: [
        "Bacterial infection (Fusobacterium necrophorum)",
        "Poor hygiene",
        "Injuries inside the mouth"
      ],
      hi: [
        "बैक्टीरियल संक्रमण (फ्युसोबैक्टीरियम नेक्रोफोरम)",
        "खराब स्वच्छता",
        "मुंह के अंदर चोट"
      ],
    },
    treatment: {
      en: [
        "Antibiotics (penicillin, oxytetracycline)",
        "Anti-inflammatory drugs",
        "Soft feed and warm water"
      ],
      hi: [
        "एंटीबायोटिक्स (पेनिसिलिन, ऑक्सीटेट्रासाइक्लिन)",
        "सूजनरोधी दवाएं",
        "नरम चारा और गुनगुना पानी"
      ],
    },
    prevention: {
      en: [
        "Clean, dry housing",
        "Proper navel and mouth hygiene",
        "Avoid overcrowding"
      ],
      hi: [
        "साफ और सूखा वातावरण",
        "नाभि और मुंह की उचित सफाई",
        "अधिक भीड़ न रखें"
      ],
    },
    recoveryTime: {
      en: "5–10 days",
      hi: "5–10 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Seek emergency care if calf cannot breathe properly.",
      hi: "यदि बछड़ा ठीक से सांस नहीं ले पा रहा है, तो आपातकालीन देखभाल लें।",
    },
  },

  foot_rot: {
    diseaseName: { en: "Foot Rot", hi: "फुट रॉट (खुर सड़न)" },
    overview: {
      en: "A bacterial infection in the hoof causing swelling, foul odor, and lameness.",
      hi: "खुर में बैक्टीरियल संक्रमण जो सूजन, बदबू और लंगड़ापन का कारण बनता है।",
    },
    symptoms: {
      en: [
        "Severe lameness",
        "Swollen and warm hoof",
        "Foul-smelling discharge",
        "Reluctance to walk"
      ],
      hi: [
        "गंभीर लंगड़ापन",
        "खुर सूजा और गर्म",
        "दुर्गंधयुक्त स्राव",
        "चलने में अनिच्छा"
      ],
    },
    causes: {
      en: [
        "Wet, muddy conditions",
        "Bacterial infection (Fusobacterium + Bacteroides)",
        "Hoof injuries"
      ],
      hi: [
        "गीला और कीचड़ वाला वातावरण",
        "बैक्टीरियल संक्रमण (फ्युसोबैक्टीरियम + बैक्टेरोइड्स)",
        "खुर की चोट"
      ],
    },
    treatment: {
      en: [
        "Antibiotics",
        "Foot bath with antiseptic",
        "Hoof cleaning",
        "Dry housing"
      ],
      hi: [
        "एंटीबायोटिक्स",
        "एंटीसेप्टिक फुट बाथ",
        "खुर की सफाई",
        "सूखा वातावरण"
      ],
    },
    prevention: {
      en: [
        "Keep floors dry",
        "Regular hoof trimming",
        "Footbaths in rainy season"
      ],
      hi: [
        "फर्श सूखा रखें",
        "नियमित खुर कटाई",
        "बारिश के मौसम में फुट बाथ"
      ],
    },
    recoveryTime: {
      en: "3–7 days",
      hi: "3–7 दिन",
    },
    severity: "Medium",
    veterinarianRequired: false,
    emergency: {
      en: "Call a vet if swelling becomes severe or animal cannot stand.",
      hi: "यदि सूजन बढ़ जाए या पशु खड़ा न हो सके, तो पशु चिकित्सक से संपर्क करें।",
    },
  },

  foot_and_mouth: {
    diseaseName: { en: "Foot and Mouth Disease (FMD)", hi: "मुंह-खुर रोग" },
    overview: {
      en: "A highly contagious viral disease affecting cattle, causing blisters in the mouth and feet.",
      hi: "बहुत तेजी से फैलने वाला वायरल रोग जो मवेशियों के मुंह और खुरों में फफोले पैदा करता है।",
    },
    symptoms: {
      en: [
        "Blisters in mouth and feet",
        "Salivation and drooling",
        "Lameness",
        "Loss of appetite",
        "Fever"
      ],
      hi: [
        "मुंह और खुरों में फफोले",
        "अत्यधिक लार गिरना",
        "लंगड़ापन",
        "भूख कम लगना",
        "बुखार"
      ],
    },
    causes: {
      en: [
        "FMD virus (highly contagious)",
        "Spread through saliva, milk, and air",
        "Contaminated equipment or people"
      ],
      hi: [
        "एफएमडी वायरस (अत्यधिक संक्रामक)",
        "लार, दूध और हवा के माध्यम से फैलना",
        "दूषित उपकरण या मनुष्यों द्वारा प्रसार"
      ],
    },
    treatment: {
      en: [
        "Supportive care (fluids, soft feed)",
        "Antiseptic mouthwash",
        "Pain relief medication"
      ],
      hi: [
        "सहायक देखभाल (तरल पदार्थ और नरम चारा)",
        "एंटीसेप्टिक माउथवॉश",
        "दर्द निवारक दवाएं"
      ],
    },
    prevention: {
      en: [
        "FMD vaccination",
        "Strict biosecurity",
        "Avoid mixing new animals with herd"
      ],
      hi: [
        "एफएमडी टीकाकरण",
        "कड़ा बायोसिक्योरिटी पालन",
        "नए पशुओं को झुंड में तुरंत न मिलाएं"
      ],
    },
    recoveryTime: {
      en: "10–20 days",
      hi: "10–20 दिन",
    },
    severity: "Very High",
    veterinarianRequired: true,
    emergency: {
      en: "Immediate veterinary help is needed due to fast spread and economic loss.",
      hi: "तेजी से फैलाव और आर्थिक नुकसान के कारण तुरंत पशु चिकित्सक से सहायता लें।",
    },
  },

  ragwort_poisoning: {
    diseaseName: { en: "Ragwort Poisoning", hi: "रैगवर्ट विषाक्तता" },
    overview: {
      en: "A toxic plant poisoning causing severe liver damage in cattle.",
      hi: "एक विषैली पौधादूषण जो मवेशियों में गंभीर लीवर क्षति पैदा करता है।",
    },
    symptoms: {
      en: [
        "Weight loss",
        "Diarrhea or constipation",
        "Photosensitivity",
        "Jaundice",
        "Neurological signs"
      ],
      hi: [
        "वजन कम होना",
        "दस्त या कब्ज",
        "धूप से त्वचा संवेदनशील होना",
        "पीलिया",
        "तंत्रिका संबंधी लक्षण"
      ],
    },
    causes: {
      en: [
        "Eating ragwort plant (contains toxic alkaloids)",
        "Contaminated hay or silage"
      ],
      hi: [
        "रैगवर्ट पौधा खाना (विषैले एल्कलॉइड्स)",
        "दूषित सूखा चारा या साइलिज"
      ],
    },
    treatment: {
      en: [
        "Supportive liver therapy",
        "Activated charcoal to reduce toxin absorption",
        "High-quality balanced diet"
      ],
      hi: [
        "लीवर के लिए सहायक उपचार",
        "विष कम करने के लिए सक्रिय चारकोल",
        "उच्च गुणवत्ता वाला संतुलित आहार"
      ],
    },
    prevention: {
      en: [
        "Remove ragwort from grazing land",
        "Avoid feeding contaminated hay",
        "Pasture inspection"
      ],
      hi: [
        "चरागाह से रैगवर्ट पौधा हटाएं",
        "दूषित सूखा चारा न खिलाएं",
        "चरागाह की नियमित जांच"
      ],
    },
    recoveryTime: {
      en: "Varies; severe cases often irreversible",
      hi: "समय अलग-अलग; गंभीर मामलों में अपरिवर्तनीय",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Seek urgent veterinary help if jaundice or neurological signs appear.",
      hi: "यदि पीलिया या तंत्रिका संबंधी लक्षण दिखें तो तुरंत मदद लें।",
    },
  },

  wooden_tongue: {
    diseaseName: { en: "Wooden Tongue", hi: "वुडन टंग (कठोर जीभ)" },
    overview: {
      en: "A bacterial infection causing hardening and swelling of the tongue in cattle.",
      hi: "एक बैक्टीरियल संक्रमण जो मवेशियों की जीभ को कठोर और सूजा हुआ बनाता है।",
    },
    symptoms: {
      en: [
        "Swollen, hard tongue",
        "Difficulty chewing and swallowing",
        "Excessive drooling",
        "Weight loss"
      ],
      hi: [
        "जीभ का सूजना और कठोर होना",
        "चबाने और निगलने में कठिनाई",
        "अत्यधिक लार गिरना",
        "वजन कम होना"
      ],
    },
    causes: {
      en: [
        "Actinobacillus lignieresii bacterial infection",
        "Injury inside the mouth"
      ],
      hi: [
        "एक्टिनोबेसिलस लिग्नियरेसी बैक्टीरिया संक्रमण",
        "मुंह के अंदर चोट"
      ],
    },
    treatment: {
      en: [
        "Sodium iodide IV treatment",
        "Antibiotics",
        "Soft feed"
      ],
      hi: [
        "सोडियम आयोडाइड IV उपचार",
        "एंटीबायोटिक्स",
        "नरम चारा"
      ],
    },
    prevention: {
      en: [
        "Avoid rough, sharp feed",
        "Maintain oral hygiene",
        "Regular checkups"
      ],
      hi: [
        "कठोर और नुकीला चारा न दें",
        "मुंह की स्वच्छता बनाए रखें",
        "नियमित जांच"
      ],
    },
    recoveryTime: {
      en: "7–14 days",
      hi: "7–14 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Seek emergency care if the animal cannot swallow.",
      hi: "यदि पशु निगल नहीं पा रहा है तो तुरंत आपातकालीन सहायता लें।",
    },
  },

  infectious_bovine_rhinotracheitis: {
    diseaseName: { en: "Infectious Bovine Rhinotracheitis (IBR)", hi: "संचारी गोवंशीय राइनोट्रेकाइटिस" },
    overview: {
      en: "A viral respiratory disease caused by bovine herpesvirus, affecting the nose, throat, and lungs.",
      hi: "गोजातीय हर्पीस वायरस द्वारा होने वाला श्वसन रोग जो नाक, गले और फेफड़ों को प्रभावित करता है।",
    },
    symptoms: {
      en: [
        "High fever",
        "Nasal discharge",
        "Severe coughing",
        "Red, inflamed eyes",
        "Reduced milk production"
      ],
      hi: [
        "तेज बुखार",
        "नाक से स्राव",
        "तेज खांसी",
        "लाल और सूजी हुई आंखें",
        "दूध उत्पादन में कमी"
      ],
    },
    causes: {
      en: [
        "Bovine herpesvirus-1 (BHV-1)",
        "Direct animal contact",
        "Contaminated equipment"
      ],
      hi: [
        "गोजातीय हर्पीस वायरस-1 (BHV-1)",
        "पशुओं के बीच सीधा संपर्क",
        "दूषित उपकरण"
      ],
    },
    treatment: {
      en: [
        "Antiviral supportive care",
        "Antibiotics to prevent secondary infections",
        "Anti-inflammatory drugs"
      ],
      hi: [
        "एंटीवायरल सहायक उपचार",
        "द्वितीयक संक्रमण रोकने के लिए एंटीबायोटिक्स",
        "सूजनरोधी दवाएं"
      ],
    },
    prevention: {
      en: [
        "IBR vaccination",
        "Isolation of sick animals",
        "Biosecurity measures"
      ],
      hi: [
        "IBR टीकाकरण",
        "बीमार पशुओं को अलग रखें",
        "बायोसिक्योरिटी उपाय"
      ],
    },
    recoveryTime: {
      en: "7–12 days",
      hi: "7–12 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Seek emergency help if severe breathing difficulty occurs.",
      hi: "यदि गंभीर सांस लेने में कठिनाई हो तो आपातकालीन सहायता लें।",
    },
  },

  acetonaemia: {
    diseaseName: { en: "Acetonaemia (Ketosis)", hi: "एसीटोनिमिया (कीटोसिस)" },
    overview: {
      en: "A metabolic disorder in high-yielding cows due to negative energy balance after calving.",
      hi: "उच्च दूध उत्पादन करने वाली गायों में बछड़ा जनने के बाद ऊर्जा की कमी के कारण होने वाला चयापचय विकार।",
    },
    symptoms: {
      en: [
        "Loss of appetite",
        "Weight loss",
        "Acetone smell in breath or milk",
        "Reduced milk yield",
        "Lethargy"
      ],
      hi: [
        "भूख में कमी",
        "वजन घटाना",
        "सांस या दूध में एसीटोन की गंध",
        "दूध उत्पादन में कमी",
        "सुस्ती"
      ],
    },
    causes: {
      en: [
        "Negative energy balance",
        "Fat breakdown leading to high ketone levels",
        "Poor nutrition after calving"
      ],
      hi: [
        "ऊर्जा की कमी",
        "वसा टूटने से कीटोन स्तर बढ़ना",
        "बछड़े के बाद खराब पोषण"
      ],
    },
    treatment: {
      en: [
        "IV glucose therapy",
        "Propylene glycol drench",
        "High-energy diet"
      ],
      hi: [
        "IV ग्लूकोज थेरेपी",
        "प्रोपलीन ग्लाइकॉल देना",
        "उच्च ऊर्जा वाला आहार"
      ],
    },
    prevention: {
      en: [
        "Proper nutrition before and after calving",
        "Balanced diet",
        "Regular monitoring of high-producing cows"
      ],
      hi: [
        "बछड़े के पहले और बाद में उचित पोषण",
        "संतुलित आहार",
        "उच्च दूध उत्पादन करने वाली गायों की नियमित निगरानी"
      ],
    },
    recoveryTime: {
      en: "3–7 days",
      hi: "3–7 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Emergency if cow is unable to stand or shows nervous signs.",
      hi: "यदि गाय खड़ी नहीं हो पा रही या तंत्रिका संबंधी लक्षण हों तो यह आपात स्थिति है।",
    },
  },

  wooden_tongue: {
    diseaseName: { en: "Wooden Tongue", hi: "लकड़ी जीभ रोग" },
    overview: {
      en: "A chronic bacterial infection (Actinobacillus lignieresii) causing hardening and swelling of the tongue.",
      hi: "एक जीर्ण बैक्टीरियल संक्रमण (Actinobacillus lignieresii) जिससे जीभ में कड़ापन और सूजन हो जाती है।",
    },
    symptoms: {
      en: [
        "Hard, swollen tongue",
        "Drooling and difficulty chewing",
        "Pain while eating",
        "Nodules or ulcers on tongue",
        "Weight loss due to inability to eat",
      ],
      hi: [
        "जीभ का सख्त और सूज जाना",
        "लार टपकना और चबाने में कठिनाई",
        "खाने में दर्द",
        "जीभ पर गाँठें या घाव",
        "खाने में असमर्थ होने से वजन घटना",
      ],
    },
    causes: {
      en: [
        "Injury inside the mouth leading to bacterial entry",
        "Rough feed materials",
        "Poor oral hygiene",
      ],
      hi: [
        "मुख के अंदर चोट जिससे बैक्टीरिया प्रवेश कर सकें",
        "कठोर या खुरदुरा चारा",
        "खराब मौखिक स्वच्छता",
      ],
    },
    treatment: {
      en: [
        "Sodium iodide IV infusion",
        "Oral potassium iodide",
        "Antibiotics such as tetracycline",
        "Soft feed to reduce pain",
      ],
      hi: [
        "सोडियम आयोडाइड IV इंजेक्शन",
        "पोटैशियम आयोडाइड का मौखिक उपयोग",
        "टेट्रासाइक्लिन जैसे एंटीबायोटिक्स",
        "दर्द कम करने के लिए नरम चारा",
      ],
    },
    prevention: {
      en: [
        "Avoid sharp feed materials",
        "Maintain oral hygiene",
        "Good-quality fodder",
      ],
      hi: [
        "नुकीला या खुरदुरा चारा न दें",
        "मौखिक स्वच्छता बनाए रखें",
        "उच्च गुणवत्ता वाला चारा दें",
      ],
    },
    recoveryTime: {
      en: "7–10 days with iodine treatment",
      hi: "आयोडीन उपचार के साथ 7–10 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Seek veterinary help if swelling increases rapidly or animal cannot eat at all",
      hi: "यदि सूजन तेजी से बढ़े या जानवर बिल्कुल न खा पाए तो तुरंत पशु चिकित्सक से संपर्क करें",
    },
  },

  infectious_bovine_rhinotracheitis: {
    diseaseName: { en: "Infectious Bovine Rhinotracheitis (IBR)", hi: "संक्रामक बोवाइन राइनोट्रेकाइटिस" },
    overview: {
      en: "A viral respiratory disease caused by Bovine Herpesvirus-1 affecting the nose, eyes, and reproductive tract.",
      hi: "बोवाइन हर्पीसवायरस-1 द्वारा फैलने वाला एक वायरल श्वसन रोग, जो नाक, आँख और प्रजनन तंत्र को प्रभावित करता है।",
    },
    symptoms: {
      en: [
        "High fever",
        "Nasal discharge (thick and red crusts)",
        "Coughing and breathing difficulty",
        "Conjunctivitis and tear discharge",
        "Reduced milk production",
        "Abortions in pregnant animals",
      ],
      hi: [
        "तेज बुखार",
        "नाक से स्राव (गाढ़ा और लाल पपड़ी)",
        "खांसी और सांस लेने में कठिनाई",
        "आँखों में सूजन और पानी आना",
        "दूध उत्पादन कम होना",
        "गर्भवती मवेशियों में गर्भपात",
      ],
    },
    causes: {
      en: [
        "Bovine Herpesvirus-1 infection",
        "Close contact with infected cattle",
        "Stressful conditions",
      ],
      hi: [
        "बोवाइन हर्पीसवायरस-1 संक्रमण",
        "संक्रमित मवेशियों के संपर्क में आना",
        "तनावपूर्ण परिस्थितियाँ",
      ],
    },
    treatment: {
      en: [
        "No specific antiviral treatment available",
        "Supportive therapy (fluids, anti-inflammatory drugs)",
        "Antibiotics to control secondary bacterial infections",
        "Good ventilation and rest",
      ],
      hi: [
        "कोई विशिष्ट एंटीवायरल उपचार उपलब्ध नहीं",
        "समर्थनकारी उपचार (तरल, सूजनरोधी दवाएँ)",
        "द्वितीयक बैक्टीरियल संक्रमण रोकने के लिए एंटीबायोटिक्स",
        "अच्छा वेंटिलेशन और आराम",
      ],
    },
    prevention: {
      en: [
        "Vaccination against IBR",
        "Isolate sick animals",
        "Improve ventilation",
      ],
      hi: [
        "IBR का टीकाकरण",
        "बीमार मवेशियों को अलग रखें",
        "वेंटिलेशन में सुधार करें",
      ],
    },
    recoveryTime: {
      en: "10–14 days with supportive care",
      hi: "समर्थनकारी देखभाल के साथ 10–14 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Call a veterinarian immediately if severe breathing distress occurs",
      hi: "यदि गंभीर सांस लेने में तकलीफ हो तो तुरंत पशु चिकित्सक को बुलाएँ",
    },
  },

  acetonaemia: {
    diseaseName: { en: "Acetonaemia (Ketosis)", hi: "एसिटोनिमिया (कीटोसिस)" },
    overview: {
      en: "A metabolic disorder in high-yielding cows caused by low blood glucose and fat breakdown producing ketones.",
      hi: "उच्च दूध देने वाली गायों में कम रक्त ग्लूकोज और वसा टूटने से बनने वाले कीटोन के कारण होने वाला चयापचय विकार।",
    },
    symptoms: {
      en: [
        "Reduced appetite",
        "Drop in milk yield",
        "Sweet or acetone-smelling breath",
        "Weight loss",
        "Dullness and low energy",
      ],
      hi: [
        "भूख कम लगना",
        "दूध उत्पादन में गिरावट",
        "सांस में मीठी या एसीटोन जैसी गंध",
        "वजन कम होना",
        "सुस्ती और ऊर्जा की कमी",
      ],
    },
    causes: {
      en: [
        "Negative energy balance after calving",
        "High milk yield with insufficient nutrition",
        "Rapid fat breakdown",
      ],
      hi: [
        "बछड़ा होने के बाद ऊर्जा की कमी",
        "अपर्याप्त पोषण के साथ उच्च दूध उत्पादन",
        "वसा का तेजी से टूटना",
      ],
    },
    treatment: {
      en: [
        "Oral propylene glycol",
        "IV glucose administration",
        "Vitamin B12 injections",
        "Improved energy-rich feed",
      ],
      hi: [
        "प्रोपलीन ग्लाइकोल का मौखिक उपयोग",
        "IV ग्लूकोज देना",
        "विटामिन B12 इंजेक्शन",
        "ऊर्जा-समृद्ध चारा देना",
      ],
    },
    prevention: {
      en: [
        "Balanced diet before and after calving",
        "Avoid sudden ration changes",
        "Provide energy supplements in early lactation",
      ],
      hi: [
        "बछड़ा होने से पहले और बाद में संतुलित आहार",
        "आहार में अचानक बदलाव न करें",
        "प्रारंभिक दुग्धावधि में ऊर्जा सप्लिमेंट दें",
      ],
    },
    recoveryTime: {
      en: "3–7 days with proper treatment",
      hi: "उचित उपचार से 3–7 दिन",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Immediate vet help if cow stops eating completely",
      hi: "यदि गाय बिल्कुल खाना बंद कर दे तो तुरंत पशु चिकित्सक से संपर्क करें",
    },
  },

  fatty_liver_syndrome: {
    diseaseName: { en: "Fatty Liver Syndrome", hi: "फैटी लिवर सिंड्रोम" },
    overview: {
      en: "A metabolic condition where excess fat accumulates in the liver, usually in high-yielding cows after calving.",
      hi: "एक चयापचय स्थिति जिसमें अतिरिक्त वसा यकृत में जमा हो जाती है, आमतौर पर बछड़ा होने के बाद उच्च उत्पादन वाली गायों में।",
    },
    symptoms: {
      en: [
        "Loss of appetite",
        "Weight loss",
        "Low milk production",
        "Weakness",
        "Ketosis symptoms",
      ],
      hi: [
        "भूख न लगना",
        "वजन कम होना",
        "दूध उत्पादन कम हो जाना",
        "कमजोरी",
        "कीटोसिस जैसे लक्षण",
      ],
    },
    causes: {
      en: [
        "Excess body fat before calving",
        "Negative energy balance",
        "Rapid mobilization of body fat",
      ],
      hi: [
        "बछड़ा होने से पहले अत्यधिक शरीर वसा",
        "ऊर्जा की कमी",
        "शरीर वसा का तेजी से टूटना",
      ],
    },
    treatment: {
      en: [
        "IV glucose",
        "Propylene glycol",
        "High-energy and high-protein diet",
        "Vitamin/mineral supplements",
      ],
      hi: [
        "IV ग्लूकोज",
        "प्रोपलीन ग्लाइकोल",
        "ऊर्जा और प्रोटीन युक्त आहार",
        "विटामिन/खनिज सप्लीमेंट",
      ],
    },
    prevention: {
      en: [
        "Avoid overfeeding before calving",
        "Provide balanced energy diet",
        "Monitor body condition score",
      ],
      hi: [
        "बछड़ा होने से पहले अत्यधिक चारा न दें",
        "संतुलित ऊर्जा आहार दें",
        "बॉडी कंडीशन स्कोर मॉनिटर करें",
      ],
    },
    recoveryTime: {
      en: "1–3 weeks depending on severity",
      hi: "तीव्रता के अनुसार 1–3 सप्ताह",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Seek vet care immediately if cow becomes unable to stand or stops eating",
      hi: "यदि गाय खड़ी न हो सके या बिल्कुल खाना बंद कर दे तो तुरंत पशु चिकित्सक से संपर्क करें",
    },
  },

  calf_pneumonia: {
    diseaseName: { en: "Calf Pneumonia", hi: "बछड़ों में निमोनिया" },
    overview: {
      en: "A serious respiratory infection in calves caused by bacteria and viruses due to poor ventilation and stress.",
      hi: "बछड़ों में होने वाला एक गंभीर श्वसन संक्रमण जो खराब वेंटिलेशन और तनाव के कारण बैक्टीरिया और वायरस से होता है।",
    },
    symptoms: {
      en: [
        "Coughing",
        "Fever",
        "Nasal discharge",
        "Rapid or labored breathing",
        "Depression and weakness",
        "Loss of appetite",
      ],
      hi: [
        "खांसी",
        "बुखार",
        "नाक से स्राव",
        "तेज या कठिन सांस लेना",
        "सुस्ती और कमजोरी",
        "भूख कम लगना",
      ],
    },
    causes: {
      en: [
        "Viral infections (BRSV, PI3, IBR)",
        "Bacterial infections (Pasteurella, Mycoplasma)",
        "Cold stress or overcrowding",
        "Poor ventilation",
      ],
      hi: [
        "वायरल संक्रमण (BRSV, PI3, IBR)",
        "बैक्टीरियल संक्रमण (पाश्चुरेला, माईकोप्लाज्मा)",
        "ठंड का तनाव या अधिक भीड़",
        "खराब वेंटिलेशन",
      ],
    },
    treatment: {
      en: [
        "Antibiotics prescribed by vet",
        "Anti-inflammatory medication",
        "Steam inhalation",
        "Warm and dry housing",
        "Electrolytes and fluids",
      ],
      hi: [
        "पशु चिकित्सक द्वारा निर्धारित एंटीबायोटिक्स",
        "सूजनरोधी दवाएं",
        "स्टीम इनहेलेशन",
        "गर्म और सूखी जगह पर रखना",
        "इलेक्ट्रोलाइट और तरल देना",
      ],
    },
    prevention: {
      en: [
        "Good colostrum intake at birth",
        "Proper ventilation",
        "Avoid overcrowding",
        "Vaccination against respiratory pathogens",
      ],
      hi: [
        "जन्म के समय अच्छी कोलोस्ट्रम मात्रा",
        "उचित वेंटिलेशन",
        "अधिक भीड़ से बचें",
        "श्वसन रोगजनकों के खिलाफ टीकाकरण",
      ],
    },
    recoveryTime: {
      en: "5–10 days with treatment",
      hi: "उपचार के साथ 5–10 दिन",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "If calf has severe breathing distress, call vet immediately",
      hi: "यदि बछड़े को साँस लेने में गंभीर कठिनाई हो तो तुरंत पशु चिकित्सक को बुलाएँ",
    },
  },

  schmallenberg_virus: {
    diseaseName: { en: "Schmallenberg Virus", hi: "श्मालेंबर्ग वायरस" },
    overview: {
      en: "A viral disease affecting cattle, sheep, and goats, causing fever, diarrhea, and congenital malformations in newborns.",
      hi: "एक वायरल रोग जो मवेशियों, भेड़ और बकरियों को प्रभावित करता है, जिससे बुखार, दस्त और नवजात में जन्मजात विकृति होती है।",
    },
    symptoms: {
      en: [
        "Fever",
        "Diarrhea",
        "Reduced milk yield",
        "Congenital malformations in offspring",
        "Lethargy"
      ],
      hi: [
        "बुखार",
        "दस्त",
        "दूध उत्पादन में कमी",
        "संतानों में जन्मजात विकृति",
        "सुस्ती"
      ],
    },
    causes: {
      en: [
        "Schmallenberg virus transmitted by midges",
        "Direct contact is rare",
        "Seasonal vector activity"
      ],
      hi: [
        "मच्छरों द्वारा फैलने वाला श्मालेंबर्ग वायरस",
        "सीधा संपर्क दुर्लभ",
        "मौसमी कीट गतिविधि"
      ],
    },
    treatment: {
      en: [
        "Supportive care only",
        "No specific antiviral treatment",
        "Maintain hydration and nutrition"
      ],
      hi: [
        "केवल सहायक देखभाल",
        "कोई विशिष्ट एंटीवायरल उपचार नहीं",
        "हाइड्रेशन और पोषण बनाए रखें"
      ],
    },
    prevention: {
      en: [
        "Vector control (midges)",
        "Vaccination where available",
        "Isolate affected animals"
      ],
      hi: [
        "कीट नियंत्रण (मच्छर)",
        "जहां उपलब्ध हो टीकाकरण",
        "संक्रमित पशुओं को अलग रखें"
      ],
    },
    recoveryTime: {
      en: "7–14 days for adult animals; congenital malformations irreversible",
      hi: "वयस्क पशुओं में 7–14 दिन; जन्मजात विकृति अपरिवर्तनीय",
    },
    severity: "Medium",
    veterinarianRequired: true,
    emergency: {
      en: "Call vet if newborns show deformities or adults show severe diarrhea",
      hi: "यदि नवजात में विकृति या वयस्क में गंभीर दस्त दिखे तो पशु चिकित्सक को बुलाएँ",
    },
  },

  trypanosomosis: {
    diseaseName: { en: "Trypanosomosis", hi: "ट्रिपनोसोमोसिस" },
    overview: {
      en: "A parasitic disease transmitted by tsetse flies causing anemia, weight loss, and lethargy in cattle.",
      hi: "एक परजीवी रोग जो सेट्से मक्खियों द्वारा फैलता है, जिससे मवेशियों में एनीमिया, वजन घटाव और सुस्ती होती है।",
    },
    symptoms: {
      en: [
        "Fever",
        "Progressive anemia",
        "Weight loss",
        "Swelling of lymph nodes",
        "Weakness and lethargy"
      ],
      hi: [
        "बुखार",
        "प्रगतिशील एनीमिया",
        "वजन कम होना",
        "लिम्फ नोड्स की सूजन",
        "कमजोरी और सुस्ती"
      ],
    },
    causes: {
      en: [
        "Trypanosome parasites transmitted by tsetse fly",
        "Contaminated blood transfusions",
        "Mechanical vectors like biting flies"
      ],
      hi: [
        "ट्रिपैनोसोम परजीवी जो सेट्से मक्खी द्वारा फैलते हैं",
        "दूषित रक्त संक्रमण",
        "काटने वाले अन्य कीट"
      ],
    },
    treatment: {
      en: [
        "Antitrypanosomal drugs (diminazene, isometamidium)",
        "Supportive care (fluids, nutrition)",
        "Control of vectors"
      ],
      hi: [
        "एंटिट्रिपैनोसोमल दवाएं (डिमिनाज़ीन, आइसोमेटामिडियम)",
        "सहायक देखभाल (तरल, पोषण)",
        "कीट नियंत्रण"
      ],
    },
    prevention: {
      en: [
        "Vector control (tsetse and biting flies)",
        "Screening and treatment of infected animals",
        "Use of insecticide-treated nets and dips"
      ],
      hi: [
        "कीट नियंत्रण (सेट्से और काटने वाली मक्खियाँ)",
        "संक्रमित पशुओं की जाँच और उपचार",
        "कीटनाशक लेप और डिप का उपयोग"
      ],
    },
    recoveryTime: {
      en: "Depends on severity; can be weeks with treatment",
      hi: "तीव्रता पर निर्भर; उपचार से हफ्तों में ठीक हो सकता है",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Call vet urgently if animal is severely anemic or weak",
      hi: "यदि पशु गंभीर रूप से एनीमिक या कमजोर हो तो तुरंत पशु चिकित्सक को बुलाएँ",
    },
  },

  fog_fever: {
    diseaseName: { en: "Fog Fever (Acute Bovine Pulmonary Edema and Emphysema)", hi: "फॉग फीवर" },
    overview: {
      en: "A respiratory disorder in adult cattle caused by ingestion of lush pasture, leading to pulmonary edema and emphysema.",
      hi: "वयस्क मवेशियों में एक श्वसन रोग, जो हरे चरागाह खाने से फेफड़ों में सूजन और इन्फ्लेमेशन पैदा करता है।",
    },
    symptoms: {
      en: [
        "Severe difficulty breathing",
        "Open-mouth breathing",
        "Coughing",
        "Rapid heart rate",
        "Sudden death in severe cases"
      ],
      hi: [
        "सांस लेने में गंभीर कठिनाई",
        "मुंह खोलकर सांस लेना",
        "खांसी",
        "तेज़ हृदय गति",
        "गंभीर मामलों में अचानक मौत"
      ],
    },
    causes: {
      en: [
        "Eating lush, rapidly growing pasture (high tryptophan content)",
        "Sudden change from dry to green pasture",
        "Adult cattle stressed or unadapted to pasture"
      ],
      hi: [
        "हरी, तेजी से बढ़ती घास खाने से (उच्च ट्रिप्टोफान सामग्री)",
        "सूखी से हरी चरागाह में अचानक बदलाव",
        "वयस्क मवेशियों में तनाव या नई चरागाह के अनुकूल न होना"
      ],
    },
    treatment: {
      en: [
        "Move animals to dry pasture",
        "Supportive therapy (oxygen, anti-inflammatory drugs)",
        "Avoid stress",
        "Veterinary care for severe cases"
      ],
      hi: [
        "पशुओं को सूखी चरागाह में ले जाएँ",
        "सहायक उपचार (ऑक्सीजन, सूजनरोधी दवाएँ)",
        "तनाव से बचें",
        "गंभीर मामलों में पशु चिकित्सक सहायता लें"
      ],
    },
    prevention: {
      en: [
        "Introduce cattle gradually to lush pasture",
        "Avoid sudden grazing changes",
        "Feed supplements to reduce tryptophan load"
      ],
      hi: [
        "पशुओं को धीरे-धीरे हरी चरागाह पर डालें",
        "अचानक चरागाह बदलने से बचें",
        "ट्रिप्टोफान लोड कम करने के लिए सप्लीमेंट दें"
      ],
    },
    recoveryTime: {
      en: "Few days to weeks depending on severity",
      hi: "तीव्रता पर निर्भर; कुछ दिनों से हफ्तों में ठीक हो सकता है",
    },
    severity: "High",
    veterinarianRequired: true,
    emergency: {
      en: "Immediate veterinary help required if cattle show severe respiratory distress",
      hi: "यदि मवेशियों को गंभीर श्वसन समस्या हो तो तुरंत पशु चिकित्सक से सहायता लें",
    },
  },  
};

export const getPrescription = (diseaseKey, language = 'en') => {
  return prescriptionData[diseaseKey] || {
    diseaseName: {
      en: diseaseKey.replace('_', ' '),
      hi: diseaseKey.replace('_', ' ')
    },
    overview: {
      en: "Disease information not available. Please consult a veterinarian.",
      hi: "रोग की जानकारी उपलब्ध नहीं है। कृपया पशु चिकित्सक से परामर्श करें।"
    },
    symptoms: {
      en: ["Consult veterinarian for specific symptoms"],
      hi: ["विशिष्ट लक्षणों के लिए पशु चिकित्सक से परामर्श करें"]
    },
    treatment: {
      en: ["Consult veterinarian for proper treatment"],
      hi: ["उचित उपचार के लिए पशु चिकित्सक से परामर्श करें"]
    },
    prevention: {
      en: ["Maintain good hygiene and nutrition"],
      hi: ["अच्छी स्वच्छता और पोषण बनाए रखें"]
    },
    severity: "Unknown",
    veterinarianRequired: true,
    emergency: {
      en: "Always consult a qualified veterinarian for accurate diagnosis and treatment",
      hi: "सटीक निदान और उपचार के लिए हमेशा योग्य पशु चिकित्सक से परामर्श करें"
    }
  };
};

// Get list of all diseases with prescriptions
export const getAllDiseasesWithPrescriptions = () => {
  return Object.keys(prescriptionData);
};

// Get diseases by severity level
export const getDiseasesBySeverity = (severity) => {
  return Object.keys(prescriptionData).filter(
    (disease) => prescriptionData[disease].severity === severity
  );
};
