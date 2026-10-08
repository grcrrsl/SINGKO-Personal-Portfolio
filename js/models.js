// ============================================================
// models.js
// OOP MODEL LAYER
// Personal Website - Integrative Programming Final Project
//
// OOP concepts demonstrated:
// 1. Classes
// 2. Objects
// 3. Inheritance
// 4. Encapsulation
// 5. Polymorphism
// ============================================================


// ============================================================
// 1. PERSON CLASS
// ============================================================
//
// This is our base/parent class.
//
// It contains information that every person has:
// - name
// - email
//
// The # symbol makes the fields PRIVATE.
// This demonstrates ENCAPSULATION.
// ============================================================

class Person {

    #name;
    #email;

    constructor(name, email) {

        this.#name = name;
        this.#email = email;

    }


    // Getter for the private name field

    get name() {

        return this.#name;

    }


    // Getter for the private email field

    get email() {

        return this.#email;

    }


    // This method will later be overridden
    // by child classes.
    //
    // This helps demonstrate POLYMORPHISM.

    getRole() {

        return "Team Member";

    }


    // General information about the person

    getSummary() {

        return `${this.#name} is a ${this.getRole()}.`;

    }

}



// ============================================================
// 2. STUDENT CLASS
// ============================================================
//
// Student INHERITS from Person.
//
// "extends Person" means Student gets the properties
// and methods of Person.
//
// This demonstrates INHERITANCE.
// ============================================================

class Student extends Person {

    #course;
    #yearLevel;
    #skills;
    #interests;

    constructor(
        name,
        email,
        course,
        yearLevel,
        skills = [],
        interests = []
    ) {

        // Call the constructor of the parent class.

        super(name, email);


        this.#course = course;

        this.#yearLevel = yearLevel;

        // Create copies so the original arrays
        // cannot be directly modified.

        this.#skills = [...skills];

        this.#interests = [...interests];

    }


    // ========================================================
    // GETTERS
    // ========================================================

    get course() {

        return this.#course;

    }


    get yearLevel() {

        return this.#yearLevel;

    }


    get skills() {

        // Return a copy instead of the private array.

        return [...this.#skills];

    }


    get interests() {

        return [...this.#interests];

    }


    // ========================================================
    // POLYMORPHISM
    // ========================================================
    //
    // Student changes the behavior of getRole()
    // from the Person class.
    //
    // Same method name,
    // different implementation.
    // ========================================================

    getRole() {

        return `${this.#yearLevel} Student`;

    }


    // ========================================================
    // METHODS FOR MODIFYING DATA
    // ========================================================

    addSkill(skill) {

        if (
            skill &&
            !this.#skills.includes(skill)
        ) {

            this.#skills.push(skill);

        }

    }


    addInterest(interest) {

        if (
            interest &&
            !this.#interests.includes(interest)
        ) {

            this.#interests.push(interest);

        }

    }

}



// ============================================================
// 3. DEVELOPER CLASS
// ============================================================
//
// Developer inherits from Student.
//
// Therefore:
//
// Person
//    ↓
// Student
//    ↓
// Developer
//
// This is MULTILEVEL INHERITANCE.
// ============================================================

class Developer extends Student {

    #specialization;

    constructor(
        name,
        email,
        course,
        yearLevel,
        skills,
        interests,
        specialization
    ) {

        super(
            name,
            email,
            course,
            yearLevel,
            skills,
            interests
        );

        this.#specialization = specialization;

    }


    get specialization() {

        return this.#specialization;

    }


    // ========================================================
    // POLYMORPHISM
    // ========================================================
    //
    // Developer overrides getRole() again.
    //
    // Person.getRole()
    //       ↓
    // Student.getRole()
    //       ↓
    // Developer.getRole()
    // ========================================================

    getRole() {

         return this.#specialization;

    }

}



// ============================================================
// 4. PROJECT CLASS
// ============================================================
//
// This class represents a project in our portfolio.
//
// Each project is an OBJECT created from this class.
// ============================================================

class Project {

    #title;
    #description;
    #category;
    #year;

    constructor(
        title,
        description,
        category,
        year
    ) {

        this.#title = title;

        this.#description = description;

        this.#category = category;

        this.#year = year;

    }


    get title() {

        return this.#title;

    }


    get description() {

        return this.#description;

    }


    get category() {

        return this.#category;

    }


    get year() {

        return this.#year;

    }

}



// ============================================================
// 5. PORTFOLIO MANAGER CLASS
// ============================================================
//
// This class manages:
//
// - Team members
// - Projects
//
// It provides methods for adding and retrieving data.
//
// This gives our application a central object that
// manages the portfolio.
// ============================================================

class PortfolioManager {

    #members;

    #projects;


    constructor() {

        this.#members = [];

        this.#projects = [];

    }


    // ========================================================
    // MEMBER METHODS
    // ========================================================

    addMember(member) {

        if (member instanceof Person) {

            this.#members.push(member);

        }

    }


    get members() {

        // Return a copy to preserve encapsulation.

        return [...this.#members];

    }


    getMemberCount() {

        return this.#members.length;

    }


    // ========================================================
    // PROJECT METHODS
    // ========================================================

    addProject(project) {

        if (project instanceof Project) {

            this.#projects.push(project);

        }

    }


    get projects() {

        return [...this.#projects];

    }


    getProjectCount() {

        return this.#projects.length;

    }

}


// ============================================================
// 6. CREATE OUR PORTFOLIO OBJECT
// ============================================================
//
// This is an OBJECT created from PortfolioManager.
// ============================================================

const portfolio = new PortfolioManager();



// ============================================================
// 7. TEAM MEMBER DATA
// ============================================================
//
// These are temporary placeholders.
//
// We will replace them with the REAL information of your
// five members later.
//
// Each member is an OBJECT created using Developer.
//
// Because Developer extends Student,
// and Student extends Person,
// these objects demonstrate inheritance.
// ============================================================


const memberData = [

    {
        name: "Balallo, Kholoe",

        email: "member1@example.com",

        course: "BS Information Technology",

        yearLevel: "3rd Year",

        skills: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        interests: [
            "Web Development",
            "Technology"
        ],

        specialization: "UI/UX Developer"

    },


    {
        name: "Garcera, Roselle",

        email: "member2@example.com",

        course: "BS Information Technology",

        yearLevel: "3rd Year",

        skills: [
            "JavaScript",
            "Java",
            "HTML",
            "CSS",
            "Git",
            "SQL"

        ],

        interests: [
            "Playing Volleyball",
            "Playing Guitar",
            "Learning New Languages (e.g. Spanish)",
            "Reading Books",
            "Listening to Music",
            "Watching Movies",
        ],

        specialization: "Web Developer"

    },


    {
        name: "Santos, Karel Alwina",

        email: "member3@example.com",

        course: "BS Information Technology",

        yearLevel: "3rd Year",

        skills: [
            "Java",
            "SQL",
            "Problem Solving"
        ],

        interests: [
            "Programming",
            "Databases"
        ],

        specialization: "Documentation"

    },


    {
        name: "Sapno, Ma. Angela",

        email: "member4@example.com",

        course: "BS Information Technology",

        yearLevel: "3rd Year",

        skills: [
            "React",
            "CSS",
            "Git"
        ],

        interests: [
            "Web Development",
            "Open Source"
        ],

        specialization: "Web Developer"

    },


    {
        name: "Umali, Anne Camille",

        email: "member5@example.com",

        course: "BS Information Technology",

        yearLevel: "3rd Year",

        skills: [
            "Documentation",
            "Testing",
            "Research"
        ],

        interests: [
            "Quality Assurance",
            "Research"
        ],

        specialization: "QA Engineer"

    }

];



// ============================================================
// 8. CONVERT DATA INTO DEVELOPER OBJECTS
// ============================================================

memberData.forEach(data => {

    const member = new Developer(

        data.name,

        data.email,

        data.course,

        data.yearLevel,

        data.skills,

        data.interests,

        data.specialization

    );


    // Add the Developer object to PortfolioManager.

    portfolio.addMember(member);

});



// ============================================================
// 9. PROJECT OBJECTS
// ============================================================
//
// The requirement asks for at least THREE projects.
// We currently have SIX sample projects.
//
// These are OBJECTS created from the Project class.
// ============================================================


const projects = [

    //BALALLO, KHOLOE
    new Project(

        "Personal Portfolio Website",

        "A responsive personal and team portfolio website created using HTML, CSS, and JavaScript.",

        "Web Development",

        2026

    ),

    new Project(

        "Cinema Ticket Booking System",

        "A web application concept for selecting seats, entering customer information, and reviewing a booking order.",

        "Web Application",

        2026

    ),


    new Project(

        "Expense Tracker",

        "An application concept for recording expenses, viewing transactions, and organizing financial information.",

        "Application Development",

        2026

    ),

    //GARCERA, ROSELLE
    new Project(

        "Senior High School Girls' Volleyball Championship",

        "One of my memorable achievements was becoming a champion in Girls' Volleyball during Senior High School. This experience taught me the importance of teamwork, discipline, perseverance, and supporting one another.",

        "Volleyball Achievement",

        2024

    ),

    new Project(

        "Computer Systems Servicing NC II Certification",

        "Successfully earned the TESDA Computer Systems Servicing NC II certification, demonstrating competencies in computer hardware servicing, installation, configuration, and basic network setup.",

        "Certification",

        2024

    ),


    new Project(

        "CUBY — Best Mobile App Award — Champion",

        "Awarded as Champion for the BSIT AppDev Best Mobile App during TechFiesta 3.0, recognizing the team’s innovative mobile application and active participation in the technology exhibit.",

        "Achivement",

        2026

    ),

    //SANTOS, KAREL ALWINA
    new Project(

        "SUB",

        "A proposed system for managing school facility reservations, schedules, and availability.",

        "Systems Development",

        2026

    ),


    new Project(

        "HealthBridge",

        "A proposed healthcare referral and care coordination system designed for community health services.",

        "Capstone Concept",

        2026

    ),


    new Project(

        "Networking Laboratory",

        "A Cisco Packet Tracer activity involving IPv4, IPv6, DHCP, NAT, and network troubleshooting.",

        "Networking",

        2026

    ),

    //SAPNO, MA. ANGELA
    new Project(

        "BSIT",

        "A proposed system for managing school facility reservations, schedules, and availability.",

        "Systems Development",

        2026

    ),

    new Project(

        "BSIT",

        "A proposed healthcare referral and care coordination system designed for community health services.",

        "Capstone Concept",

        2026

    ),


    new Project(

        "BSIT",

        "A Cisco Packet Tracer activity involving IPv4, IPv6, DHCP, NAT, and network troubleshooting.",

        "Networking",

        2026

    ),

    //UMALI, ANNE CAMILLE
    new Project(

        "Web",

        "A proposed system for managing school facility reservations, schedules, and availability.",

        "Systems Development",

        2026

    ),

    new Project(

        "Web",

        "A proposed healthcare referral and care coordination system designed for community health services.",

        "Capstone Concept",

        2026

    ),


    new Project(

        "Web",

        "A Cisco Packet Tracer activity involving IPv4, IPv6, DHCP, NAT, and network troubleshooting.",

        "Networking",

        2026

    )

];

// ============================================================
// 10. ADD PROJECTS TO PORTFOLIO
// ============================================================

projects.forEach(project => {

    portfolio.addProject(project);

});



// ============================================================
// 11. DEVELOPMENT CHECK
// ============================================================
//
// These console messages help us verify that the OOP
// implementation is working correctly.
//
// Open the browser:
//
// Right Click → Inspect → Console
// ============================================================

console.log(
    "======================================"
);

console.log(
    "PERSONAL WEBSITE OOP SYSTEM"
);

console.log(
    "======================================"
);


console.log(
    "Total Members:",
    portfolio.getMemberCount()
);


console.log(
    "Total Projects:",
    portfolio.getProjectCount()
);


console.log(
    "First Member:",
    portfolio.members[0]
);


console.log(
    "First Member Role:",
    portfolio.members[0].getRole()
);


console.log(
    "First Member Summary:",
    portfolio.members[0].getSummary()
);


console.log(
    "======================================"
);