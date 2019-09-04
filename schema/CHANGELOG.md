# Schema draft-02 Change Log

## Property Changes

* Rename `html` -> `template`
* Rename `offlineCompatibile` -> `offlineCompatible`
* Rename `bridgeAPIMethods` -> `jsApiMethods`
* Refactor `isData` -> `source`
* Refactor `previewName` -> `previewType`
* Add `creatorAcknowlegements`
* Add `parentBundle`
* Add `libraries`
* Add `urlLocation`
* Add `config.type`
* Add `config.value`
* Add `config.path`
* Add `config.help`
* Add `config.category`
* Add `config.label`
* Add `config.sort`
* Add `config.possibleValues`
* Remove loose type support
* Remove `hashLoad`

## Custom Errors

* Add ajv-errors custom `errorMessage` support

## Custom Enums

### `config.source` enum

Options
* `config`
* `data`
* `libraries`

### `config.type` enum changes

Changed Options
* `json array` -> `jsonArray` // JSONArray
* `json object` -> `jsonObject` // JSONObject
* `CSS Snippet` -> `cssSnippet` // JSONString
* `HTML Snippet` -> `htmlSnippet` // JSONString
* `JS Snippet` -> `jsSnippet` // JSONString
* `booleanCheck` -> `boolean` // JSONBoolean

Unchanged Options
* `number` // JSONNumber
* `text` // JSONString
* `largeText` // JSONString
* `color`  // JSONString
* `padding` // JSONString
* `textAlign` // JSONString
* `verticalAlign` // JSONString
* `fmpFileName` // JSONString
* `fmpScriptName` // JSONString
* `dropdown` // JSONString
* `popup` // JSONString

### `previewType` enum

Options
* `jpg`
* `png`
