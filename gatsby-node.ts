import { GatsbyNode } from "gatsby"

import * as path from "path"

export const createPages: GatsbyNode["createPages"] = async ({
	graphql,
	actions,
	reporter,
}) => {
	const { createPage } = actions

	// Create pages for blog posts
	{
		// Define a template for blog post
		const templatePath = path.resolve(`./src/templates/post.tsx`)

		// Get all markdown blog posts sorted by date

		// TODO(teawithsand): sort posts by date
		const result = await graphql(`
			query PostsForPages {
				allFile(
					filter: {
						sourceInstanceName: { eq: "blog" }
						name: { eq: "index" }
						extension: { eq: "md" }
					}
				) {
					nodes {
						id
						childMarkdownRemark {
							fields {
								path
								uuidPath
							}
							frontmatter {
								slug
								title
								language
							}
						}
					}
				}
			}
		`)

		if (result.errors) {
			reporter.panicOnBuild(
				`There was an error loading blog posts`,
				result.errors,
			)
			return
		}

		const posts = (result.data as any).allFile.nodes.filter(n => !!n)

		if (posts.length > 0) {
			posts.forEach((post, index) => {
				const previousPostId = index === 0 ? null : posts[index - 1].id
				const nextPostId =
					index === posts.length - 1 ? null : posts[index + 1].id

				const postPath = post.childMarkdownRemark.fields.path
				const uuidPostPath = post.childMarkdownRemark.fields.uuidPath
				const postLanguage =
					post.childMarkdownRemark.frontmatter.language

				createPage({
					path: postPath,
					component: templatePath,
					context: {
						id: post.id,
						previousPostId,
						nextPostId,
						language: postLanguage,
					},
				})

				createPage({
					path: uuidPostPath,
					component: templatePath,
					context: {
						id: post.id,
						previousPostId,
						nextPostId,
						language: postLanguage,
					},
				})
			})
		}
	}

	// Create pages for all tags
	{
		// Define a template for blog post
		const templatePath = path.resolve(`./src/templates/tag.tsx`)

		// Get all markdown blog posts sorted by date
		const result = await graphql(`
			query TagsForPages {
				allFile(
					filter: {
						sourceInstanceName: { eq: "blog" }
						name: { eq: "index" }
						extension: { eq: "md" }
					}
				) {
					group(
						field: {
							childMarkdownRemark: {
								frontmatter: { tags: SELECT }
							}
						}
					) {
						tag: fieldValue
						count: totalCount
					}
				}
			}
		`)

		if (result.errors) {
			reporter.panicOnBuild(
				`There was an error loading blog posts by tags`,
				result.errors,
			)
			return
		}

		const postByTags = result.data.allFile.group
		// Create blog posts pages
		// But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
		// `context` is available in the template as a prop and as a variable in GraphQL

		if (postByTags.length > 0) {
			postByTags.forEach(post => {
				createPage({
					path: "/tag/" + post.tag,
					component: templatePath,
					context: {
						tag: post.tag,
						count: post.count,
					},
				})
			})
		}
	}
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions }) => {
	const { createNodeField } = actions

	if (
		node.internal.type === `MarkdownRemark` &&
		typeof node.frontmatter === "object"
	) {
		const slug = (node as any).frontmatter.slug ?? ""
		const uuid = (node as any).frontmatter.uuid ?? ""
		const language = (
			(node as any).frontmatter.language ?? ""
		).toLowerCase()
		const path = `/${language}/post/${slug}`
		const uuidPath = `/${language}/post/${uuid}`

		createNodeField({
			node,
			name: "path",
			value: path,
		})

		createNodeField({
			node,
			name: "uuidPath",
			value: uuidPath,
		})

		createNodeField({
			node,
			name: "slug",
			value: slug,
		})
	}
}

export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] =
	({ actions }) => {
		// TODO(teawithsand): add types here, so no error happens when there is no posts
		const { createTypes } = actions

		createTypes(`
	type SiteSiteMetadata {
		siteUrl: String
	}
	type MarkdownRemark implements Node {
		frontmatter: Frontmatter
		fields: Fields
	}
	type Frontmatter {
		title: String
		description: String
		createdAt: Date @dateformat
		lastEditedAt: Date @dateformat
		tags: [String]
		language: String
		topic: String
	}
	type Fields {
		slug: String
		path: String
	}
	`)
	}
