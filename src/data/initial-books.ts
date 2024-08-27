export const initialBooks = [
      "The Da Vinci Code",
      "The Bourne Identity",
      "Angels & Demons",
      "Casino Royale",
      "The Hunt for Red October",
      "Die Hard",
      "Jack Reacher: Killing Floor",
      "The Girl with the Dragon Tattoo",
      "Red Sparrow",
      "Patriot Games",
      "The Hobbit",
      "Treasure Island",
      "The Three Musketeers",
      "Life of Pi",
      "Journey to the Center of the Earth",
      "Around the World in Eighty Days",
      "Robinson Crusoe",
      "The Count of Monte Cristo",
      "Into the Wild",
      "The Call of the Wild",
      "It",
      "The Shining",
      "Dracula",
      "Frankenstein",
      "Pet Sematary",
      "The Exorcist",
      "The Haunting of Hill House",
      "Salem's Lot",
      "Bird Box",
      "The Silence of the Lambs",
      "Sapiens: A Brief History of Humankind",
      "Guns, Germs, and Steel",
      "The History of the Ancient World",
      "The Silk Roads: A New History of the World",
      "A People's History of the United States",
      "The Diary of a Young Girl",
      "The Wright Brothers",
      "Team of Rivals",
      "The Rise and Fall of the Third Reich",
      "The History of the Decline and Fall of the Roman Empire",
      "Thinking, Fast and Slow",
      "Outliers: The Story of Success",
      "How to Win Friends and Influence People",
      "The Power of Habit",
      "Atomic Habits",
      "The 7 Habits of Highly Effective People",
      "Mindset: The New Psychology of Success",
      "The Lean Startup",
      "The Art of War",
      "Blink: The Power of Thinking Without Thinking",
      "The Bible",
      "The Quran",
      "The Bhagavad Gita",
      "Mere Christianity",
      "The Case for Christ",
      "The Tao Te Ching",
      "The Book of Mormon",
      "The Imitation of Christ",
      "The Power of Now",
      "The Purpose Driven Life",
      "Meditations by Marcus Aurelius",
      "The Republic by Plato",
      "Nicomachean Ethics by Aristotle",
      "Beyond Good and Evil by Friedrich Nietzsche",
      "Critique of Pure Reason by Immanuel Kant",
      "Being and Time by Martin Heidegger",
      "The Art of War by Sun Tzu",
      "The Prince by Niccolò Machiavelli",
      "The Social Contract by Jean-Jacques Rousseau",
      "The Tao Te Ching by Laozi",
      "Pride and Prejudice",
      "Jane Eyre",
      "Wuthering Heights",
      "Gone with the Wind",
      "Anna Karenina",
      "Sense and Sensibility",
      "The Great Gatsby",
      "The Catcher in the Rye",
      "Romeo and Juliet",
      "Love in the Time of Cholera"
];



export interface GoogleBooks {
    kind:       string;
    totalItems: number;
    items:      Item[];
  }
  
  export interface Item {
    kind:       Kind;
    id:         string;
    etag:       string;
    selfLink:   string;
    volumeInfo: VolumeInfo;
    saleInfo:   SaleInfo;
    accessInfo: AccessInfo;
    searchInfo: SearchInfo;
  }
  
  export interface AccessInfo {
    country:                Country;
    viewability:            Viewability;
    embeddable:             boolean;
    publicDomain:           boolean;
    textToSpeechPermission: TextToSpeechPermission;
    epub:                   Epub;
    pdf:                    Epub;
    webReaderLink:          string;
    accessViewStatus:       AccessViewStatus;
    quoteSharingAllowed:    boolean;
  }
  
  export enum AccessViewStatus {
    None = "NONE",
    Sample = "SAMPLE",
  }
  
  export enum Country {
    Us = "US",
  }
  
  export interface Epub {
    isAvailable:   boolean;
    acsTokenLink?: string;
  }
  
  export enum TextToSpeechPermission {
    Allowed = "ALLOWED",
  }
  
  export enum Viewability {
    NoPages = "NO_PAGES",
    Partial = "PARTIAL",
  }
  
  export enum Kind {
    BooksVolume = "books#volume",
  }
  
  export interface SaleInfo {
    country:      Country;
    saleability:  Saleability;
    isEbook:      boolean;
    listPrice?:   SaleInfoListPrice;
    retailPrice?: SaleInfoListPrice;
    buyLink?:     string;
    offers?:      Offer[];
  }
  
  export interface SaleInfoListPrice {
    amount:       number;
    currencyCode: string;
  }
  
  export interface Offer {
    finskyOfferType: number;
    listPrice:       OfferListPrice;
    retailPrice:     OfferListPrice;
    giftable:        boolean;
  }
  
  export interface OfferListPrice {
    amountInMicros: number;
    currencyCode:   string;
  }
  
  export enum Saleability {
    ForSale = "FOR_SALE",
    NotForSale = "NOT_FOR_SALE",
  }
  
  export interface SearchInfo {
    textSnippet: string;
  }
  
  export interface VolumeInfo {
    title:               string;
    subtitle?:           string;
    authors:             string[];
    publishedDate:       string;
    description?:        string;
    industryIdentifiers: IndustryIdentifier[];
    readingModes:        ReadingModes;
    pageCount?:          number;
    printType:           PrintType;
    categories?:         string[];
    averageRating?:      number;
    ratingsCount?:       number;
    maturityRating:      MaturityRating;
    allowAnonLogging:    boolean;
    contentVersion:      string;
    panelizationSummary: PanelizationSummary;
    imageLinks:          ImageLinks;
    language:            Language;
    previewLink:         string;
    infoLink:            string;
    canonicalVolumeLink: string;
    publisher?:          string;
  }
  
  export interface ImageLinks {
    smallThumbnail: string;
    thumbnail:      string;
  }
  
  export interface IndustryIdentifier {
    type:       Type;
    identifier: string;
  }
  
  export enum Type {
    Isbn10 = "ISBN_10",
    Isbn13 = "ISBN_13",
    Other = "OTHER",
  }
  
  export enum Language {
    En = "en",
  }
  
  export enum MaturityRating {
    NotMature = "NOT_MATURE",
  }
  
  export interface PanelizationSummary {
    containsEpubBubbles:  boolean;
    containsImageBubbles: boolean;
  }
  
  export enum PrintType {
    Book = "BOOK",
  }
  
  export interface ReadingModes {
    text:  boolean;
    image: boolean;
  }
  