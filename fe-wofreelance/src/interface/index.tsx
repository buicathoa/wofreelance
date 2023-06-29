import { AlertProps } from 'antd';
import dayjs from 'dayjs';
export interface ResponseFormatItem {
    message: string | undefined,
    data?: any,
    code?: number,
    token?: string,
    status?: number,
    url?: Array<any>
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


export interface ResponsePostInterface {
    id: number,
    title: string,
    project_detail: string,
    project_budget: number,
    bidding_time_start: Date,
    bidding_time_end: Date,
    project_paid_type: string,
    post_status?: string,
    file?: string,
    post_type: string,
    user_id: number,
    createdAt: Date,
    updatedAt: Date,
    list_skills: Array<SkillsetInterface>
}

export interface PortfolioInterface {
    id: number,
    description: string,
    file?: string,
    summary?: string,
    title: string,
    createdAt: Date,
    updatedAt: Date,
    skills: Array<SkillsetInterface>,
    portfolio_type: string
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

export interface AlertBannerComponentInterface {
    title?: string,
    description?: string,
    type: any,
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

export interface ModalPortfolioInterface {
    visible: boolean,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
    portfolioItem: PortfolioInterface
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
    description?: string,
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
    list_experiences?: Array<ExperiencesInterface>,
    hourly_rate?: number,
    avatar_cropped?: string,
    country?: {
        id?: number,
        country_name?: string,
        country_official_name?: string
    },
    current_time?: string
}

export interface CurrencyInterface {
    id: number,
    name: string,
    createdAt: Date,
    updatedAt: Date,
    short_name: string
}

export interface BudgetInterface {
    id: number,
    currency: CurrencyInterface,
    minimum: number,
    maximum?: number,
    name: string,
    project_type: string,
    createdAt?: Date,
    updatedAt?: Date
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

export interface AddressGeneratedInterface {
    province?: string,
    zip_code?: number,
    country_id?: number,
    current_time?: string
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

export interface PortfolioInterface {
    id: number,
    user_id: number,
    description: string,
    file?: string,
    summary?: string,
    skillset_id: number,
    createdAt: Date,
    updatedAt: Date,
    title: string
}

export interface EducationInterface {
    id?: number,
    university_name?: string,
    country_id?: number,
    createdAt?: Date,
    updatedAt?: Date
}

export interface AvatarUserInterface {
    isOpenModifyAvt?: boolean,
    setIsOpenModifyAvt: React.Dispatch<React.SetStateAction<boolean>>,
    fileUploaded?: any,
    setFileUploaded: React.Dispatch<React.SetStateAction<any>>
}

export interface QualificationInterface {
    id?: number,
    certificate_name?: string,
    organization_name?: string,
    summary?: string,
    start_year?: dayjs.Dayjs,
    createdAt?: Date,
    updatedAt?: Date,
    user_id?: number
}

export interface UserEducationInterface {
    degree?: string,
    end_year?: Date,
    id: number,
    start_year?: Date,
    university_name?: string,
    country_id?: number,
    country?: any
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
    address_generated: AddressGeneratedInterface,
    user_info: UserInterface
}

export interface categoryReducerInterface {
    categories: Array<CategoryInterface>,
    skillsets: Array<SkillsetInterface>
}

export interface experienceReducerInterface {
    experiences: Array<ExperiencesInterface> 
}

export interface portfolioReducerInterface {
    portfolios: Array<PortfolioInterface> 
}

export interface qualificationReducerInterface {
    qualifications: Array<QualificationInterface> 
}

export interface educationReducerInterface {
    educations: Array<EducationInterface>,
    user_educations: Array<UserEducationInterface>
}

export interface locationReducerInterface {
    countries: Array<CountryInterface>,
}

