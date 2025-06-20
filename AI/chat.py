from flask import Flask, request, jsonify
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# الأسئلة والإجابات بناءً على الحالة
baby_cry_advice_en = {
    "The baby has a fever": "If the baby has a fever, apply warm compresses to their forehead until you reach the doctor.",
    "The baby is spitting up": "Keep the baby in an upright position for a while and burp them. Feed them at a slight angle, and gently pat their back.",
    "The baby has colic": "Try gently massaging their belly or letting them lie comfortably to calm down. If it continues for more than a day, see a doctor.",
    "The baby is hungry": "The baby might be hungry. Try feeding them every two hours, and remember that a newborn’s stomach is the size of a grape.",
    "The baby is crying even after eating": "The baby might want to sleep. Try calming them in a quiet place or putting them in their crib.",
    "The baby is rubbing their eyes": "The baby is probably tired or sleepy. Try calming them down and placing them in a quiet environment.",
    "The baby is suddenly crying": "This could be due to pain. Check the baby for any health issues like colic, indigestion, or a dirty diaper.",
    "The baby has a cough": "If the baby has a cough, check the room temperature and keep the air moist. If the cough continues, consult a doctor.",
    "The baby refuses to sleep in the crib": "Try calming the baby in a quiet place or gently holding them until they settle down.",
    "The baby is teething": "Teething can cause gum pain. Try giving a cold teething ring to soothe the pain and be patient.",
    "The baby has skin redness": "If you notice redness, check for diaper rash or allergies. Consult a doctor and follow the treatment instructions.",
    "The baby feels cold": "Make sure the baby is well wrapped and in a warm place. If the cold continues, add warm clothes or a blanket.",
    "The baby cries a lot at night": "Babies often cry more at night due to tiredness. Try calming them with gentle movements or giving them milk.",
    "The baby wants to keep a specific toy": "Sometimes a baby feels comforted by a favorite toy. Try giving them their favorite toy to calm them.",
    "The baby has digestive issues": "The baby might have indigestion or gas. Try gently massaging their belly or changing their position after feeding.",
    "The baby has eye redness": "If the baby's eye is red, check for foreign bodies. If the redness continues or there are secretions, consult a doctor.",
    "The baby is constipated": "Try gently massaging the baby's belly or adjusting their diet if appropriate for their age. If it continues, consult a doctor.",
    "The baby refuses to sleep in the evening": "The baby might be exhausted or stressed. Create a calm environment by dimming lights and reducing noise.",
    "The baby has difficulty breathing": "If the baby has trouble breathing or a blocked nose, try saline drops or use a humidifier.",
    "The baby is screaming for no clear reason": "Sometimes babies scream due to stress or environmental changes like loud noise. Try calming them with soft sounds or gentle holding.",
    "The baby is vomiting after feeding": "Make sure to burp the baby properly after feeding. If vomiting continues, consult a doctor.",
    "The baby has an allergy to something": "If you suspect an allergy, remove the suspected item and monitor symptoms. If they persist, consult a doctor.",
    "The baby has hearing issues": "If the baby doesn't respond to sounds or shows hearing delays, consult a specialist.",
    "The baby sleeps more than usual": "Sometimes excessive sleep can be due to stress or illness. If it continues abnormally, consult a doctor.",
    "The baby has blood in stool": "This may indicate a health issue like an allergy or infection. Consult a doctor immediately if blood appears in the stool.",
    "The baby is dehydrated": "Ensure the baby is getting enough fluids. If you suspect dehydration, consult a doctor immediately.",
    "The baby refuses to feed": "Try changing feeding positions or ensure the nipple is clean and suitable. Refusal might be due to teething or a health issue.",
    "The baby has a diaper rash": "Change diapers frequently, use rash creams, and if the rash continues, consult a doctor."
}


# قائمة الأسئلة لعرضها في الواجهة بمواعيد التطعيمات بناءً على سن الطفل
vaccination_schedule = {
    "Newborn": "Hepatitis B vaccine dose within 24 hours of birth.",
    "2 Months": "Polio vaccine, Pentavalent vaccine, Rotavirus vaccine, and Pneumococcal vaccine.",
    "4 Months": "Second dose of Polio, Pentavalent, Rotavirus, and Pneumococcal vaccines.",
    "6 Months": "Third dose of Polio, Pentavalent, Rotavirus, and Pneumococcal vaccines.",
    "9 Months": "Single-dose Measles vaccine.",
    "1 Year": "Booster dose of MMR (Measles, Mumps, Rubella) and Hepatitis A vaccine.",
    "1.5 Years": "Pertussis, Measles, Mumps, and Rubella vaccines.",
    "Over 1.5 Years": "Continue preventive vaccinations according to the Ministry of Health schedule."
}


# بيانات الأم مقسمة حسب الفئة الفرعية
mother_questions = {

    "Postpartum Recovery": {
        "How long does physical recovery take after childbirth?": "Recovery after vaginal delivery usually takes 6 to 8 weeks, while a C-section may require 8 to 12 weeks. However, this varies from woman to woman.",
        "What are the normal physical changes after childbirth?": "Vaginal bleeding (lochia) lasts 2 to 6 weeks. Abdominal bloating and uterine cramps. Hair loss and skin changes. Pain in the perineal area or C-section wound. Changes in the breasts and increased discharge.",
        "When does the menstrual cycle return?": "If breastfeeding, the cycle may be delayed for several months. If not breastfeeding, it may return 6 to 8 weeks after birth.",
        "Is it normal to feel depressed after childbirth?": "Yes, about 70–80% of mothers experience baby blues, which disappear within two weeks. Postpartum depression is more severe and requires medical treatment.",
        "What are the warning signs after childbirth?": "Excessive or prolonged bleeding, high fever, swelling and redness in the leg, severe pain in the abdomen or wound, symptoms of severe depression.",
        "When can I start exercising after childbirth?": "After 6 weeks for vaginal delivery, and after consulting your doctor in the case of a C-section.",
        "Is breastfeeding painful? How can I avoid pain?": "It can be painful at first if the baby does not latch properly. Ensure the correct position while breastfeeding.",
        "When can I start using contraception after childbirth?": "Some methods can be used immediately, while others need to be delayed. Consult your doctor.",
        "Is it normal to feel lonely or anxious after childbirth?": "Yes, it’s known as baby blues, and if it persists or worsens, you should seek help.",
        "When can I drive after childbirth?": "About a week after vaginal delivery, and 4–6 weeks after a C-section or as medically advised.",
        "How can I deal with body shape changes (like belly or stretch marks)?": "Light exercise, moisturizing creams, emotional support, and patience; the body needs time to recover.",
        "Can I fast or follow a diet after childbirth?": "Strict dieting is not recommended, especially during breastfeeding. A balanced diet is advised.",
        "Can I fast or follow a diet after childbirth?": "Strict dieting is not recommended, especially during breastfeeding. A balanced diet is advised.",
    },

    "Important Questions Before Childbirth (Third Trimester)": {
        "What are the signs that labor is near?": "Cervical dilation, belly dropping lower, frequent contractions, loss of the mucus plug.",
        "When should I go to the hospital?": "When contractions occur every 5 minutes for an hour, water breaks, or there is bleeding.",
        "Is natural or cesarean delivery better?": "It depends on the condition of the mother and baby. Natural birth is preferred unless there's a medical risk.",
        "What are the final tests or checkups before delivery?": "GBS bacteria screening, fetal monitoring, and cervical examination.",
        "How can I prepare my body and mind for labor?": "Breathing exercises, pelvic floor strengthening (Kegel), relaxation, and emotional support from a partner or midwife.",
        "Is it safe to travel during pregnancy?": "Yes, usually safe until week 36 if there are no complications. Use a seatbelt, move around hourly, and stay hydrated.",
        "What are the necessary tests and checkups during pregnancy?": "Blood tests, urine analysis, glucose screening, ultrasounds, vitamin level checks, and screening for fetal abnormalities.",
        "What are the warning signs of complications during pregnancy?": "Vaginal bleeding, severe swelling in the face or hands, intense headaches, blurred vision, reduced fetal movement, or severe abdominal pain.",
        "Are there safe exercises during pregnancy?": "Yes, such as walking, swimming, prenatal yoga, and pelvic floor exercises (Kegel).",
        "When should I prepare the hospital bag?": "Preferably between weeks 32 and 36. It should include clothes, hygiene items, ID documents, and baby essentials.",
    },

    "Important Questions About Episiotomy": {
        "What is an episiotomy?": "It is a small surgical cut made in the area between the vagina and anus (perineum) to enlarge the vaginal opening for easier baby delivery.",
        "Is episiotomy always performed?": "No, it is no longer routine. It is done only when necessary (fast delivery, difficult labor, or baby’s heart rate drops).",
        "What is the difference between an episiotomy and natural tearing?": "Natural tearing happens on its own and may be less harmful than an episiotomy in some cases. Some studies suggest natural tears heal faster than surgical cuts.",
        "How can I reduce the chance of needing an episiotomy?": "Perineal massage from week 34 of pregnancy, labor positions that allow more flexibility, and following the doctor's instructions during pushing to avoid excess pressure.",
        "How long does an episiotomy take to heal?": "Usually 2 to 4 weeks. It may take longer if the cut is large or complications occur. Rest, cleanliness, and pain relief help in healing.",
    },

    "How to Choose the Right Doctor for Delivery?": {
        "Experience and specialization": "Choose a gynecologist-obstetrician with experience in delivery cases similar to yours (natural, C-section, or high-risk).",
        "Communication style": "You should feel comfortable communicating with the doctor, who should be understanding of your concerns and answer your questions patiently.",
        "Support for your birth plan": "Does the doctor support natural birth or having a partner in the delivery room? Do they agree with your written birth plan? This reflects their respect for your wishes.",
        "Reviews and recommendations:": "Ask other mothers or read reviews on trusted medical websites.",
        "Availability at birth time:": "Confirm whether they will actually be present for your delivery or if a different on-call team will handle it.",
        "Delivery location:": "Choose a doctor affiliated with a trusted hospital that has proper maternal and neonatal care units, especially if complications are possible.",
    }
}

@app.route('/')
def index():
   return app.send_static_file('index.html')



# 1. عرض الفئات الرئيسية: الطفل - الأم
@app.route('/get_categories', methods=['GET'])
def get_categories():
    print("Request received at /get_categories")
    return jsonify({"categories": ["Child", "Mother"]})


# 2. الفئات الفرعية لكل فئة رئيسية
subcategories = {
    "Child": ["Baby Crying Reasons", "Vaccination Schedule"],
    "Mother": ["Postpartum Recovery", 
               "Important Questions Before Childbirth (Third Trimester)", 
               "Important Questions About Episiotomy", 
               "How to Choose the Right Doctor for Delivery?"]
}

@app.route('/get_subcategories', methods=['GET'])
def get_subcategories():
    category = request.args.get("category", "")  
    print("Received category:", category) 

    subs = subcategories.get(category)
    if subs:
        return jsonify({"subcategories": subs})
    return jsonify({"error": "Unknown category."}), 400



# 3. استرجاع الأسئلة حسب الفئة المختارة
@app.route('/get_questions_by_category', methods=['POST'])
def get_questions_by_category():
    data = request.json
    category = data.get("category", "")
    subcategory = data.get("subcategory", "")

    if category == "Child":
        if subcategory == "Baby Crying Reasons":
            return jsonify({"questions": list(baby_cry_advice_en.keys())})
        elif subcategory == "Vaccination Schedule":
            return jsonify({"questions": list(vaccination_schedule.keys())})
    elif category == "Mother":
        questions = mother_questions.get(subcategory)
        if questions:
            return jsonify({"questions": list(questions.keys())})
    return jsonify({"error": "Unknown category or subcategory."}), 400


# 4. استرجاع الإجابة على سؤال محدد
@app.route('/ask_question', methods=['POST'])
def ask_question():
    data = request.json
    question = data.get("question", "")

    # أولاً نبحث في بيانات الطفل
    response = baby_cry_advice_en.get(question)
    if response:
        return jsonify({"response": response})

    # بعدين نبحث في كل الفئات الفرعية الخاصة بالأم
    for subcat in mother_questions.values():
        if question in subcat:
            return jsonify({"response": subcat[question]})

    return jsonify({"response": "I'm not sure about your question, but I can help you analyze your baby's crying cause if you'd like."})


# 5. استرجاع التطعيمات حسب عمر الطفل
@app.route('/get_vaccination_schedule', methods=['POST'])
def get_vaccination_schedule_by_age():
    data = request.json
    child_age = data.get("age", "")
    schedule = vaccination_schedule.get(child_age, "Please select an appropriate age from the list.")
    return jsonify({"vaccination_schedule": schedule})


if __name__ == '__main__':
   app.run(port=5000, debug=True)
