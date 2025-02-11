import { generateModelsAsync, textHelper } from '@kentico/kontent-model-generator'
import dotenv from 'dotenv'
import { readdirSync, unlinkSync } from 'fs'

dotenv.config({
	path: '../.env',
})

const fixNumberPrefixElementResolver = elementName => {
	if (elementName[0] >= '0' && elementName[0] <= '9') {
		return `_${elementName}`
	}
	return elementName
}
const runAsync = async () => {
	// TODO: clear the models folder first
	const files = readdirSync('.')
	files.forEach(f => unlinkSync(f))

	await generateModelsAsync({
		sdkType: 'delivery',
		projectId: process.env.KONTENT_PROJECT_ID,
		addTimestamp: false,
		elementResolver: (type, elementName) => `${fixNumberPrefixElementResolver(textHelper.toCamelCase(elementName))}`,
		fileResolver: type => `${textHelper.toPascalCase(type.system.codename)}Model`,
		contentTypeResolver: type => `${textHelper.toPascalCase(type.system.codename)}Model`,
	})
}

// Self-invocation async function
;(async () => {
	await runAsync()
})().catch(err => {
	console.error(err)
	throw err
})
