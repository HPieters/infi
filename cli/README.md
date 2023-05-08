# Keep Talking and Everybody Codes - CLI

CLI for the Keep Talking and Everybody Codes from Infi.

## Getting started

1. Have Node.js installed on your system, see .nvmrc for the version. Recommended to use either [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions on your machine.
2. Install dependencies: `npm install`
3. Ensure you have installed the dependancies in the `shared` folder as well (../shared).
4. Run the cli: `$ node search.mjs --name Neude`

## Exercise

Make a program or script that allows the use to search through a CLI a part of the camera _name_, for example:

```sh
# call PHP via CLI
php search.php --name Neude

# Or if you used .NET Core
dotnet Search --name Neude

# Etc.
```

Expected output:

```none
501 | UTR-CM-501 Neude rijbaan voor Postkantoor | 52.093421 | 5.118278
503 | UTR-CM-503 Neude plein | 52.093448 | 5.118536
504 | UTR-CM-504 Neude / Schoutenstraat | 52.092995 | 5.119088
505 | UTR-CM-505 Neude / Drakenburgstraat / Vinkenurgstraat | 52.092843 | 5.118351
506 | UTR-CM-506 Vinkenburgstraat / Neude | 52.092378 | 5.117902
507 | UTR-CM-507 Vinkenburgstraat richting Neude | 52.092234 | 5.117766
```

## Next steps

- Tests
