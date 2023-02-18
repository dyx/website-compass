export interface WebsiteModel {
  categoryName: string
  websites: WebsiteItemModel[]
}
export interface WebsiteItemModel {
  name: string
  link: string
  description?: string
}
