# Integrity Checker
Easily verify the integrity of files within a project.

* Easily check whether a file has been modified
* Check the hash codes of a file
* Customize encryption keys to the project/folder/files
* Easily hash files within CLI or through JS.

# Usage
This library can be used in:
* Node (Plain JavaScript)
* Node (TypeScript)

## Use with Node (JavaScript)
Use npm to install it:

cd into the root directory of your project, where the package.json file is located and do:
```
> npm install integrity-checker --save
```

import it into your project:
```JavaScript
const integrity = require("integrity-checker");

function integrityCheck() {
    if (integrity.checkDir("./", "Key", "IV")) {
        // Integrity check passed - Files not modified
    } else {
        // Integrity check failed - Files possibly modified
    }
}
```

## Use with Node (TypeScript)
Use npm to install it:

cd into the root directory of your project, where the package.json file is located and do:
```
> npm install integrity-checker --save
```

import it into your project:
```JavaScript
import integrity from "integrity-checker";

function integrityCheck() {
    if (integrity.checkDir("./", "Key", "IV")) {
        // Integrity check passed - Files not modified
    } else {
        // Integrity check failed - Files possibly modified
    }
}
```

# Commands
For quick access to the hash values of a project/folder/file, you can use these commands:

```
> integrity check <file> <key> <iv>
Check the integrity of a file.

> integrity save <file> [key] [iv]
Save the file's hash for a integrity check.

> integrity hash <file>
Get the hash value of a file.

> integrity genkeys
Generate keys for hash encryption.
```

# Information
You can easily implement the module into your project, for checking the integrity of files when someone uses the application. We recommend that you include a integrity check on all files in at least 2+ files so that if someone changes one the other files will detect that.

