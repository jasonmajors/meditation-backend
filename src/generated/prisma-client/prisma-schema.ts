// Code generated by Prisma (prisma@1.32.2). DO NOT EDIT.
  // Please don't change this file manually but run `prisma generate` to update it.
  // For more information, please read the docs: https://www.prisma.io/docs/prisma-client/

export const typeDefs = /* GraphQL */ `type AggregateMeditation {
  count: Int!
}

type AggregateUser {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar Long

type Meditation {
  id: ID!
  title: String!
  description: String!
  img_url: String!
  audio_url: String!
}

type MeditationConnection {
  pageInfo: PageInfo!
  edges: [MeditationEdge]!
  aggregate: AggregateMeditation!
}

input MeditationCreateInput {
  title: String!
  description: String!
  img_url: String!
  audio_url: String!
}

type MeditationEdge {
  node: Meditation!
  cursor: String!
}

enum MeditationOrderByInput {
  id_ASC
  id_DESC
  title_ASC
  title_DESC
  description_ASC
  description_DESC
  img_url_ASC
  img_url_DESC
  audio_url_ASC
  audio_url_DESC
}

type MeditationPreviousValues {
  id: ID!
  title: String!
  description: String!
  img_url: String!
  audio_url: String!
}

type MeditationSubscriptionPayload {
  mutation: MutationType!
  node: Meditation
  updatedFields: [String!]
  previousValues: MeditationPreviousValues
}

input MeditationSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: MeditationWhereInput
  AND: [MeditationSubscriptionWhereInput!]
  OR: [MeditationSubscriptionWhereInput!]
  NOT: [MeditationSubscriptionWhereInput!]
}

input MeditationUpdateInput {
  title: String
  description: String
  img_url: String
  audio_url: String
}

input MeditationUpdateManyMutationInput {
  title: String
  description: String
  img_url: String
  audio_url: String
}

input MeditationWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  img_url: String
  img_url_not: String
  img_url_in: [String!]
  img_url_not_in: [String!]
  img_url_lt: String
  img_url_lte: String
  img_url_gt: String
  img_url_gte: String
  img_url_contains: String
  img_url_not_contains: String
  img_url_starts_with: String
  img_url_not_starts_with: String
  img_url_ends_with: String
  img_url_not_ends_with: String
  audio_url: String
  audio_url_not: String
  audio_url_in: [String!]
  audio_url_not_in: [String!]
  audio_url_lt: String
  audio_url_lte: String
  audio_url_gt: String
  audio_url_gte: String
  audio_url_contains: String
  audio_url_not_contains: String
  audio_url_starts_with: String
  audio_url_not_starts_with: String
  audio_url_ends_with: String
  audio_url_not_ends_with: String
  AND: [MeditationWhereInput!]
  OR: [MeditationWhereInput!]
  NOT: [MeditationWhereInput!]
}

input MeditationWhereUniqueInput {
  id: ID
  title: String
}

type Mutation {
  createMeditation(data: MeditationCreateInput!): Meditation!
  updateMeditation(data: MeditationUpdateInput!, where: MeditationWhereUniqueInput!): Meditation
  updateManyMeditations(data: MeditationUpdateManyMutationInput!, where: MeditationWhereInput): BatchPayload!
  upsertMeditation(where: MeditationWhereUniqueInput!, create: MeditationCreateInput!, update: MeditationUpdateInput!): Meditation!
  deleteMeditation(where: MeditationWhereUniqueInput!): Meditation
  deleteManyMeditations(where: MeditationWhereInput): BatchPayload!
  createUser(data: UserCreateInput!): User!
  updateUser(data: UserUpdateInput!, where: UserWhereUniqueInput!): User
  updateManyUsers(data: UserUpdateManyMutationInput!, where: UserWhereInput): BatchPayload!
  upsertUser(where: UserWhereUniqueInput!, create: UserCreateInput!, update: UserUpdateInput!): User!
  deleteUser(where: UserWhereUniqueInput!): User
  deleteManyUsers(where: UserWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Query {
  meditation(where: MeditationWhereUniqueInput!): Meditation
  meditations(where: MeditationWhereInput, orderBy: MeditationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Meditation]!
  meditationsConnection(where: MeditationWhereInput, orderBy: MeditationOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): MeditationConnection!
  user(where: UserWhereUniqueInput!): User
  users(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [User]!
  usersConnection(where: UserWhereInput, orderBy: UserOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): UserConnection!
  node(id: ID!): Node
}

type Subscription {
  meditation(where: MeditationSubscriptionWhereInput): MeditationSubscriptionPayload
  user(where: UserSubscriptionWhereInput): UserSubscriptionPayload
}

type User {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserConnection {
  pageInfo: PageInfo!
  edges: [UserEdge]!
  aggregate: AggregateUser!
}

input UserCreateInput {
  name: String!
  email: String!
  password: String!
}

type UserEdge {
  node: User!
  cursor: String!
}

enum UserOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  email_ASC
  email_DESC
  password_ASC
  password_DESC
}

type UserPreviousValues {
  id: ID!
  name: String!
  email: String!
  password: String!
}

type UserSubscriptionPayload {
  mutation: MutationType!
  node: User
  updatedFields: [String!]
  previousValues: UserPreviousValues
}

input UserSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: UserWhereInput
  AND: [UserSubscriptionWhereInput!]
  OR: [UserSubscriptionWhereInput!]
  NOT: [UserSubscriptionWhereInput!]
}

input UserUpdateInput {
  name: String
  email: String
  password: String
}

input UserUpdateManyMutationInput {
  name: String
  email: String
  password: String
}

input UserWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  AND: [UserWhereInput!]
  OR: [UserWhereInput!]
  NOT: [UserWhereInput!]
}

input UserWhereUniqueInput {
  id: ID
  email: String
}
`