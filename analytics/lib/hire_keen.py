from keen.client import KeenClient
import simplejson
import datetime, config
from pytz import timezone

class HireKeen:

    def __init__(self):
        self.keenWriter = KeenClient(
            project_id=config.KEEN_PROJECTID,
            write_key=config.KEEN_WRITEKEY,
            read_key=config.KEEN_READKEY
        )        

    def record_keen(self, index, event):
        self.keenWriter.add_event(index, event)

    def extract_keen(self, index, timeframe, filters):
        return self.keenWriter.extraction(index, timeframe, filters=filters)

    def pred_identify(self, user_id):
        self.identified = True
        self.predclient.identify(user_id)

    def pred_ranked(self, engine, data):
        return self.predclient.get_itemrank_ranked(engine, data)

    def pred_top_rec(self, engine, number):
        return self.predclient.get_itemrec_topn(engine, number)

    def pred_create(self, user, userType):
        self.predclient.create_user(user, {'userType': userType})

    def event_record_register(self, loggedin_id):
        user_details = self.db_user.find_one({'linkedin_id': loggedin_id})
        if user_details:
            event_data = {
                "action": "registration",
                "userId": user_details['linkedin_id'],
                "userCompanyId": user_details['linkedin_company_id']
            }
            recordEvent.delay('siteActions', event_data)

    def event_record_activate(self, loggedin_id):
        user_details = self.db_user.find_one({'linkedin_id': loggedin_id})
        if user_details:
            event_data = {
                "action": "activation",
                "userId": user_details['linkedin_id'],
                "userCompanyId": user_details['linkedin_company_id']
            }
            recordEvent.delay('siteActions', event_data)

    def event_record_create_project(self, project_slug, user_id):
        project_details = self.db_project.find_one({'slug': project_slug, 'loggedin_id': user_id})
        if project_details:
            try:
                user_details = self.db_user.find_one({'linkedin_id': project_details['loggedin_id']})
                company_details = self.db_linkedincompany.find_one({'id': user_details['linkedin_company_id']})
                event_data = {
                    "action": "project creation",
                    "userId": project_details['loggedin_id'],
                    "userCompanyId": user_details['linkedin_company_id'],
                    "slug": project_slug,
                    "skills": [],
                    "addlSkills": [],
                    "userCompany": company_details['name'],
                    "forCompanyId": project_details['companyId'],
                    "forCompanyName": project_details['company'],
                    "name": project_details['name']
                }
                for skill in project_details['skills']:
                    if skill['skill'] not in event_data['skills']:
                        event_data['skills'].append(skill['skill'])
                for addlskill in project_details['addlSkills']:
                    if addlskill not in event_data['addlSkills']:
                        event_data['addlSkills'].append(addlskill)
                recordEvent.delay('siteActions', event_data)
            except:
                rollbar.report_exc_info()

    def event_record_create_position(self, project_slug, position_slug, user_id):
        position_details = self.db_position.find_one({'project': project_slug, 'slug': position_slug, 'loggedin_id': user_id})
        if position_details:
            try:
                user_details = self.db_user.find_one({'linkedin_id': position_details['loggedin_id']})
                company_details = self.db_linkedincompany.find_one({'id': user_details['linkedin_company_id']})
                project_details = self.db_project.find_one({'slug': project_slug})
                event_data = {
                    "action": "position creation",
                    "userId": user_details['linkedin_id'],
                    "companyId": user_details['linkedin_company_id'],
                    "slug": position_details['slug'],
                    "projectslug": position_details['project'],
                    "skills": [],
                    "addlSkills": [],
                    "userCompany": company_details['name'],
                    "forCompanyId": project_details['companyId'],
                    "forCompanyName": project_details['company'],
                    "title": position_details['title'],
                    "projectName": project_details['name']
                }
                for skill in position_details['skills']:
                    if skill['skill'] not in event_data['skills']:
                        event_data['skills'].append(skill['skill'])
                for addlskill in position_details['addlSkills']:
                    if addlskill not in event_data['addlSkills']:
                        event_data['addlSkills'].append(addlskill)
                recordEvent.delay('siteActions', event_data)
            except:
                rollbar.report_exc_info()

    def event_record_resumesearch(self, position_slug, loggedin_id):
        resumesearch_details = self.db_searchlog.find_one({'slug': position_slug, 'loggedin_id': loggedin_id})
        if resumesearch_details:
            try:
                user_details = self.db_user.find_one({'linkedin_id': loggedin_id})
                company_details = self.db_linkedincompany.find_one({'id': user_details['linkedin_company_id']})
                position_details = self.db_position.find_one({'loggedin_id': loggedin_id, 'slug': position_slug})
                project_details = self.db_project.find_one({'slug': position_details['project']})
                event_data = {
                    "action": "resume search",
                    "userId": loggedin_id,
                    "companyId": user_details['linkedin_company_id'],
                    "positionslug": position_slug,
                    "projectslug": position_details['project'],
                    "userCompany": company_details['name'],
                    "forCompanyId": project_details['companyId'],
                    "forCompanyName": project_details['company'],
                    "title": position_details['title'],
                    "projectName": project_details['name'],
                    "results": resumesearch_details['results'],
                    "site": resumesearch_details['site']
                }
                recordEvent.delay('siteActions', event_data)
            except:
                rollbar.report_exc_info()

    def event_record_resumedownload(self, position_slug, loggedin_id, doc_id):
        download_details = self.db_positionexternalrel.find_one({'position_slug': position_slug, 'loggedin_id': loggedin_id, 'doc_id': doc_id})
        if download_details:
            try:
                user_details = self.db_user.find_one({'linkedin_id': loggedin_id})
                company_details = self.db_linkedincompany.find_one({'id': user_details['linkedin_company_id']})
                position_details = self.db_position.find_one({'loggedin_id': loggedin_id, 'slug': position_slug})
                project_details = self.db_project.find_one({'slug': position_details['project']})
                event_data = {
                    "action": "resume download",
                    "userId": loggedin_id,
                    "companyId": user_details['linkedin_company_id'],
                    "positionslug": position_slug,
                    "projectslug": position_details['project'],
                    "userCompany": company_details['name'],
                    "forCompanyId": project_details['companyId'],
                    "forCompanyName": project_details['company'],
                    "title": position_details['title'],
                    "projectName": project_details['name'],
                    "site": download_details['source'],
                    "resumeid": doc_id
                }
                recordEvent.delay('siteActions', event_data)
            except:
                rollbar.report_exc_info()