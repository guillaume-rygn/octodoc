import fs from "fs-extra" 
import path from "path"

function deleteAllFileInsideFolder(pathElement) {
  if (fs.existsSync(pathElement)) {
    console.log(pathElement)
      fs.readdirSync(pathElement).forEach((element) => {
          const elementPath = path.join(pathElement, element);
          if (fs.lstatSync(elementPath).isDirectory()) {
            deleteAllFileInsideFolder(elementPath);
          } else {
              fs.unlinkSync(elementPath);
          }
      });
  }
}

fs.readFile('package.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier package.json :', err);
      return;
    }
  
    try {
        const packageData = JSON.parse(data);
        const dependencies = packageData.dependencies || {};
  
        const dependencyList = Object.keys(dependencies).map(dep => `{"name":"${dep.replace("/","_")}", "repository_name":"${dep}"}`);
  
        const folderName = '.octodoc';

        if (!fs.existsSync(folderName)) {
          fs.mkdirSync(folderName);
          console.log(`Le dossier "${folderName}" a été créé avec succès.`);
        } else {
          console.log(`Le dossier "${folderName}" existe déjà.`);
          deleteAllFileInsideFolder(folderName)
        }

        const dependenciesDirectory = path.join(folderName, 'dependencies');

        if (!fs.existsSync(dependenciesDirectory)) {
        fs.mkdirSync(dependenciesDirectory);
        console.log(`Le répertoire "${dependenciesDirectory}" a été créé avec succès.`);
        } else {
        console.log(`Le répertoire "${dependenciesDirectory}" existe déjà.`);
        }

        fs.writeFile(path.join(folderName, ".nojekyll"), "", 'utf8', (err3) => {
            if (err3) {
                console.error('Erreur lors de l\'écriture du fichier de destination :', err3);
                return;
            }
        });

        const dataHTML = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Document</title>
          <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
          <meta name="description" content="Description">
          <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
          <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
        </head>
        <body>
          <div id="app"></div>
          <script>
            window.$docsify = {
                loadSidebar: "_sidebar.md",
                auto2top: true, 
                name: '🐙 Octodoc',
                homepage: "README.md",
                maxLevel: 2,
                subMaxLevel: 2,
            }
          </script>
          <!-- Docsify v4 -->
          <script src="//cdn.jsdelivr.net/npm/docsify@4"></script>
          <script src="https://unpkg.com/docsify/lib/plugins/search.js"></script>
          <script src="https://unpkg.com/docsify-themeable"></script>
        </body>
        </html>
        `

        fs.writeFile(path.join(folderName, "index.html"), dataHTML, 'utf8', (err3) => {
            if (err3) {
                console.error('Erreur lors de l\'écriture du fichier de destination :', err3);
                return;
            }
        });


        fs.writeFile(path.join(folderName, "README.md"), "# BIENVENUE SUR OCTODOC 🐙\n\nCommencez à explorer les documentations de vos dependances dès maintenant au même endroit !", 'utf8', (err3) => {
            if (err3) {
                console.error('Erreur lors de l\'écriture du fichier de destination :', err3);
                return;
            }
        });

        let _side;

        if (fs.existsSync("README.md")) {
          _side = `- [Home](/)\n- **My documentation**\n- [${packageData.name}](/myDocumentation.md)\n- **Dependancies**\n`

          fs.access("README.md", fs.constants.R_OK, (err1) => {
            if (!err1) {
              fs.readFile("README.md", 'utf8', (err, data) => {
                if (err) {
                  console.error('Erreur lors de la lecture du fichier README.md :', err);
                  return;
                }
                fs.writeFile(path.join(folderName, "myDocumentation.md"), data, 'utf8', (err2) => {
                  if (err2) {
                    console.error('Erreur lors de l\'écriture du fichier de destination :', err2);
                    return;
                  }
                })
              })
            }
          })

        } else if(fs.existsSync("readme.md")){
          _side = `- [Home](/)\n- **My documentation**\n- [${packageData.name}](/myDocumentation.md)\n- **Dependancies**\n`

          fs.access("readme.md", fs.constants.R_OK, (err1) => {
            if (!err1) {
              fs.readFile("readme.md", 'utf8', (err, data) => {
                if (err) {
                  console.error('Erreur lors de la lecture du fichier README.md :', err);
                  return;
                }
                fs.writeFile(path.join(folderName, "myDocumentation.md"), data, 'utf8', (err2) => {
                  if (err2) {
                    console.error('Erreur lors de l\'écriture du fichier de destination :', err2);
                    return;
                  }
                })
              })
            }
          })
        } else {
          _side = `- [Home](/)\n- **Dependancies**\n`
        }

        fs.writeFile(path.join(folderName, "_sidebar.md"), _side, 'utf8', (err3) => {
            if (err3) {
                console.error('Erreur lors de l\'écriture du fichier de destination :', err3);
                return;
            }
        });

        dependencyList.map((element) => {
            const packageInfo = JSON.parse(element);
            const filePath = path.join(dependenciesDirectory, packageInfo.name + '.md');
            const readmePath = path.join('node_modules', packageInfo.repository_name, 'README.md');
            const readmedownCasePath = path.join('node_modules', packageInfo.repository_name, 'readme.md');
          
            fs.access(readmePath, fs.constants.R_OK, (err1) => {
              if (!err1) {
                fs.readFile(readmePath, 'utf8', (err, data) => {
                  if (err) {
                    console.error('Erreur lors de la lecture du fichier README.md :', err);
                    return;
                  }
                  fs.writeFile(filePath, data, 'utf8', (err2) => {
                    if (err2) {
                      console.error('Erreur lors de l\'écriture du fichier de destination :', err2);
                      return;
                    }

                    fs.open('.octodoc/_sidebar.md', 'a', (err, fd) => {
                        if (err) {
                          console.error('Erreur lors de l\'ouverture du fichier :', err);
                          return;
                        }
                      
                        fs.appendFile(fd, `- [${packageInfo.name}](${filePath.replace(/\.\.\/\.\.\/\.octodoc\//g, '')})\n`, 'utf8', (err) => {
                          if (err) {
                            console.error('Erreur lors de l\'écriture dans le fichier :', err);
                          } else {
                            console.log('Le contenu a été ajouté avec succès au fichier.');
                          }
                      
                          fs.close(fd, (err) => {
                            if (err) {
                              console.error('Erreur lors de la fermeture du fichier :', err);
                            }
                          });
                        });
                      });

                  });
                });
              } else {
                fs.access(readmedownCasePath, fs.constants.R_OK, (err2) => {
                  if (!err2) {
                    fs.readFile(readmedownCasePath, 'utf8', (err, data) => {
                      if (err) {
                        console.error('Erreur lors de la lecture du fichier readme.md :', err);
                        return;
                      }
                      fs.writeFile(filePath, data, 'utf8', (err3) => {
                        if (err3) {
                          console.error('Erreur lors de l\'écriture du fichier de destination :', err3);
                          return;
                        }

                        fs.open('.octodoc/_sidebar.md', 'a', (err, fd) => {
                            if (err) {
                              console.error('Erreur lors de l\'ouverture du fichier :', err);
                              return;
                            }
                          
                            fs.appendFile(fd, `- [${packageInfo.name}](${filePath.replace(/\.\.\/\.\.\/\.octodoc\//g, '')})\n`, 'utf8', (err) => {
                              if (err) {
                                console.error('Erreur lors de l\'écriture dans le fichier :', err);
                              } else {
                                console.log('Le contenu a été ajouté avec succès au fichier.');
                              }
                          
                              fs.close(fd, (err) => {
                                if (err) {
                                  console.error('Erreur lors de la fermeture du fichier :', err);
                                }
                              });
                            });
                          });
    
                    
                      });
                    });
                  } else {
                    console.error(`Aucun fichier README.md ou readme.md trouvé pour ${packageInfo.name}.`);
                  }
                });
              }
            });
        });

        const newScript = {
          "octodoc": "docsify serve .octodoc",
          "updatedoc": "node ./node_modules/octodoc/indexUpdate.js"
        };
        
        if (!packageData.scripts) {
          packageData.scripts = {};
        }

        Object.assign(packageData.scripts, newScript);

        fs.writeFile('package.json', JSON.stringify(packageData, null, 2), (err) => {
          if (err) {
            console.error("Une erreur s'est produite lors de l'écriture dans le fichier package.json :", err);
          } else {
            console.log(`Le script "doc" a été ajouté avec succès au fichier package.json.`);
          }
        });        

    } catch (e) {
      console.error('Erreur lors de la parsing du fichier JSON :', e);
    }
  });

