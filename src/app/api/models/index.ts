export interface IPouchDBAllDocsResult {
    offset: number;
    total_rows: number;
    rows: IPouchDBRow[];
}

export interface IPouchDBGetResult {
    _id: string;
    _rev: string;
}

export interface IPouchDBGetUserResult extends IPouchDBGetResult {
    name: string;
}

export interface IPouchDBPutResult {
    ok: boolean;
    id: string;
    rev: string;
}

export interface IPouchDBRemoveResult {
    ok: boolean;
    id: string;
    rev: string;
}

export interface IPouchDBRow {
    id: string;
    key: string;
    value: { rev: string };
    doc?: any;
}

export interface IPouchDBCreateIndexResult {
    result: string;
}

export interface IPouchDBFindUsersResult {
    docs: User[];
    warning?: string;
}

export class User {
    _id: string;
    username: string;
    password: string;
    name: string;
    surname: string;
    email: string;
    phoneNr: string;

    constructor(username: string, passsword: string, name: string, surname: string, email: string, phoneNr: string) {
        this._id = 'user:' + new Date().getTime();
        this.username = username;
        this.password = passsword;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.phoneNr = phoneNr;
    }
}

export class Patient {
    _id?: string;
    personalInfo: PatientPersonalInfo;
    medicalHistory: MedicalHistoryItem[];

    constructor(patient: Patient) {
        this._id = patient._id;
        this.personalInfo = patient.personalInfo;
        this.medicalHistory = patient.medicalHistory;
    }
}

export class PatientPersonalInfo {
    name: string;
    surname: string;
    dateOfBirth: Date;
    address: Address;
    profession: string;

    constructor(name: string, surname: string, dateOfBirth: Date, address: Address, profession: string) {
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.address = address;
        this.profession = profession;
    }
}

export class MedicalHistoryItem {
    _id: string;
    date: Date;
    anamnesis: Anamnesis;
    diagnostics: Diagnostics;
    statusLocalis: string;
    diagnosis: string;
    recommendedTherapy: Therapy;
    user: string;

    constructor(
        date: Date,
        anamnesis: Anamnesis,
        diagnostics: Diagnostics,
        statusLocalis: string,
        diagnosis: string,
        recommendedTherapy: Therapy,
        user: string,
        _id?: string
    ) {
        this._id = _id;
        this.date = date;
        this.anamnesis = anamnesis;
        this.diagnostics = diagnostics;
        this.statusLocalis = statusLocalis;
        this.diagnosis  = diagnosis;
        this.recommendedTherapy = recommendedTherapy;
        this.user = user;
    }
}

export class Address {
    country: string;
    city: string;
    postcode: Number;
    street: string;
    streetNo: string;

    constructor(country: string, city: string, postcode: Number, street: string, streetNo: string) {
        this.country = country;
        this.city = city;
        this.postcode = postcode;
        this.street = street;
        this.streetNo = streetNo;
    }
}

export class Anamnesis {
    mainDifficulties: string;
    anamnesisMorbi: string;
    anamnesisVitae: string;
    anamnesisFamiliae: string;

    constructor(mainDifficulties: string, anamnesisMorbi: string, anamnesisVitae: string, anamnesisFamiliae: string) {
        this.mainDifficulties = mainDifficulties;
        this.anamnesisMorbi = anamnesisMorbi;
        this.anamnesisVitae = anamnesisVitae;
        this.anamnesisFamiliae = anamnesisFamiliae;
    }
}

export class Diagnostics {
    labFindings: string;
    labFindings_date: Date;
    RTG: string;
    RTG_date: Date;
    NMR: string;
    NMR_date: Date;
    EMNG: string;
    EMNG_date: Date;

    constructor(
        labFindings: string, labFindings_date: Date,
        RTG: string, RTG_date: Date,
        NMR: string, NMR_date: Date,
        EMNG: string, EMNG_date: Date
    ) {
        this.labFindings = labFindings;
        this.labFindings_date = labFindings_date;
        this.RTG = RTG;
        this.RTG_date = RTG_date;
        this.NMR = NMR;
        this.NMR_date = NMR_date;
        this.EMNG = EMNG;
        this.EMNG_date = EMNG_date;
    }
}

export class Therapy {
    recommendation: string;
    mediocentricTherapy: string;
    physicalTherapy: PhysicalTherapy;

    constructor(recommendation: string, mediocentricTherapy: string, physicalTherapy: PhysicalTherapy) {
        this.recommendation = recommendation;
        this.mediocentricTherapy = mediocentricTherapy;
        this.physicalTherapy = physicalTherapy;
    }
}

export class PhysicalTherapy {
    laserTherapy: LaserTherapyChoices[];
    electroTherapy: ElectroTherapy;
    cryotherapy: boolean;
    IMP: boolean;
    ultrasound: boolean;

    constructor(
        cryotherapy: boolean,
        IMP: boolean,
        ultrasound: boolean,
        laserTherapy?: LaserTherapyChoices[],
        electroTherapy?: ElectroTherapy
    ) {
        this.laserTherapy = laserTherapy;
        this.electroTherapy = electroTherapy;
        this.cryotherapy = cryotherapy;
        this.IMP = IMP;
        this.ultrasound = ultrasound;
    }
}

export enum LaserTherapyChoices {
    One = <any>'2500Hz - 6J',
    Two = <any>'80Hz - 8J',
    Three = <any>'600Hz - 6J',
    Four = <any>'80Hz - 8J',
    Five = <any>'80Hz - 16J'
}

export class ElectroTherapy {
    IFS: boolean;
    DD: boolean;
    GS: boolean;
    ES: boolean;

    constructor(IFS: boolean, DD: boolean, GS: boolean, ES: boolean) {
        this.IFS = IFS;
        this.DD = DD;
        this.GS = GS;
        this.ES = ES;
    }
}

export class Appointment {
    _id: string;
    user: string;
    patient: string;
    patientName: string;
    dateAndTime: Date;
    description: string;

    constructor(user: string, patient: string, patientName: string, dateAndTime: Date, description: string) {
        this.user = user;
        this.patient = patient;
        this.patientName = patientName;
        this.dateAndTime = dateAndTime;
        this.description = description;
    }
}
