# Balze ADB backup Process

This pipeline, automates back up process of changed ADB files. The automation backs up all changed ADB files and rename the files in the format `filename.<timestamp>.backup`. The backup file should be found in thesame folder of the ADB file. 

The pipeline takes input value of the country code to determine which folder to perform backup on. The pipeline first triggers `get_servers_list.yml` this is the entry point of the automation process which collects the list of hosts of the tomcat servers and then trigger the final workflow `on workflow call`.

## Steps under Blaze ADB Deploy Step

1. Stops Tom Cat service on Each Server.
    - This first step stops the tomcat service on the Blaze ADB server.

2. Backup and Flag Changed ADB files
    - It ssh into the tomcat server and then attempt to iterate through the ADB_source directories to get the correct path of the ADB file. It then checks if there is a change in both files by generating a checksum. If there is a difference in the checksum, the script then proceeds to back up the ADB file using the timestamp and `.bkup` file extension.

3. Deploy new ADB files
    - this step loops through the ADB_source directory and then determine the deployment path and deploy only files that changed.

4. Start Tomcat
    - this step starts tomcat server back.