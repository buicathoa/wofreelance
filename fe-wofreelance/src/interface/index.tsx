export interface ResponseFormatItem {
    message?: string,
    data?: {
        data?: any,
        token?: any,
        avatar?: string,
        list_skills?: Array<SkillsetInterface>
    },
    code?: number,
    token?: string
}


export interface ResponseFormatList {
    code?: number,
    data?: Array<any>,
    token?: string,
    message?: string
}

export interface SkillsetInterface {
    id?: number,
    name?: string,
    job_matching_count?: number,
    createdAt?: Date,
    updatedAt?: Date
}

export interface CategoryInterface {
    createdAt?: Date,
    updatedAt?: Date,
    id?: number,
    name?: string,
    list_skills?: Array<SkillsetInterface>
}

export interface CategorySkillsetNewFreelance {
    code?: number,
    data?: Array<any>
}

export interface SignupFormInterface {
    username ?: string,
    email ?: string,
    password ?: string
}

export interface SkillselectedComponentInterface {
    skillsetSelected?: Array<SkillsetInterface>,
    setSkillsetSelected?:  React.Dispatch<React.SetStateAction<Array<SkillsetInterface>>>,
    setPercent?: React.Dispatch<React.SetStateAction<number>>,
}

export interface ModalConfirmInterface {
    title?: string,
    icon?:  any | null,
    content?: string | null,
    description?: string | null,
    visible?: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    onConfirm: any
}

export interface LinkAccountsComponentInterface {
    setPercent?: React.Dispatch<React.SetStateAction<number>>,
}

export interface ProfileDetailInterface {
    setPercent: React.Dispatch<React.SetStateAction<number>>
}

export interface UserInterface {
    id?: number,
    email?: string,
    password?: string,
    is_verified_account?: boolean,
    facebook?: boolean,
    linkedin?: boolean,
    avatar?: string,
    education?: string,
    birthdate?: string,
    title?: string,
    describe?: string,
    personal_website?: string,
    yoe?: Float32Array,
    cv_uploaded?: string,
    other_certifications?: string,
    account_status?: string,
    latest_online_time?: Date,
    joined?: Date,
    is_open?: boolean,
    working_time?: string,
    products_link?: string,
    createdAt?: Date,
    updatedAt?: Date,
    role_id?: number,
    username?: string,
    account_type?: string,
    languages?: Array<LanguagesInterface>,
    first_name?: string,
    last_name?: string,
    list_skills?: Array<SkillsetInterface>,
    list_experiences?: Array<ExperiencesInterface>
}

export interface LanguagesInterface {
    id?: number,
    language?: string,
    code?: string,
    english_name?: string,
    iso_639_1?: string,
    iso_639_2?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export interface ExperiencesInterface {
    id?: number,
    title?: string,
    company?: string,
    date_start?: Date,
    date_end?: Date,
    summary?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export interface EducationInterface {
    id?: number,
    university_name?: string,
    country_id?: number,
    createdAt?: Date,
    updatedAt?: Date
}

export interface UserEducationInterface {
    degree?: string,
    end_year?: Date,
    id: number,
    start_year?: Date,
    university_name?: string
}

export interface CountryInterface {
    id?: number,
    country_name?: string,
    country_official_name?: string,
    createdAt?: Date,
    updatedAt?: Date
}

export interface PhotoandNameComponentInterface{
    fileUploaded?: File,
    setFileUploaded?: React.Dispatch<React.SetStateAction<File>>,
    formValues?: any,
    setformValues?: React.Dispatch<React.SetStateAction<any>>
}

export interface Notifications {
    openWarning: () => void
    // notiMess?: string | null,
    // notiDuration?: number | null,
    // placement?: string | null
}


export interface SkillSelectionComponentInterface {
    listCategory?: Array<CategoryInterface>,
    skillsetSelected?: Array<SkillsetInterface>,
    setSkillsetSelected: React.Dispatch<React.SetStateAction<any>>,
    listSkills?: Array<SkillsetInterface>,
    setListSkills:  React.Dispatch<React.SetStateAction<any>>,
    categorySelected?: CategoryInterface,
    setCategorySelected: React.Dispatch<React.SetStateAction<any>>,
    debouncedText?: string,
    matchJobs?: number,
    setMatchJobs: React.Dispatch<React.SetStateAction<any>>,
    valueSearch?: string,
    setValueSearch: React.Dispatch<React.SetStateAction<any>>
}

export interface SkillComponentInterface {
    isOpen?: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export interface userReducerInterface {
    user: UserInterface,
    user_skills: Array<SkillsetInterface>,
    languages: Array<LanguagesInterface>,
}

export interface categoryReducerInterface {
    categories: Array<CategoryInterface>,
    skillsets: Array<SkillsetInterface>
}

export interface experienceReducerInterface {
    experiences: Array<ExperiencesInterface> 
}

export interface educationReducerInterface {
    educations: Array<EducationInterface>,
    countries: Array<CountryInterface>,
    user_educations: Array<UserEducationInterface>
}