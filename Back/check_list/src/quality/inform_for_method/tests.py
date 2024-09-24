# import json
#
# from django.core.exceptions import ValidationError, ObjectDoesNotExist
# from rest_framework.reverse import reverse
# from rest_framework.test import APITestCase
#
# from customer_companies.customers.models import Customer
# from customer_companies.fields.models import Field
# from customer_companies.wellbores.models import Wellbore
# from customer_companies.wells.models import Well
# from service_companies.methods.models import Method
# from service_companies.service_method.models import Service_device, Service_method
# from service_companies.services.models import Service
# from .models import Inform_for_method, Koef_fail, Koef_shod
# from .serializers import Inform_for_methodSerializer, Koef_failSerializer, Koef_shodSerializer
# from . import views as inform_for_method_views
# from .service_logics import InformMethodFullGetServices, InformMethodFullPostServices
# from ..quality_control.models import Quality_control
# from ..second_table.models import Second_table
# from ..second_table.serializers import Second_tableSerializer
# from ..second_table.service_logic import SecondTableFullGet
#
#
# class TestField(APITestCase):
#
#     def setUp(self) -> None:
#         customer = Customer.objects.create(name='Customer_1')
#         field = Field.objects.create(name='Field_1', customer=customer)
#         self.well = Well.objects.create(num_well='Well_1', num_pad='num_1',
#                                         well_type='', field=field)
#         wellbore = Wellbore.objects.create(num_wellbore='num_1', pie_well='', diametr=None, well=self.well)
#         self.quality_control = Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',
#                                                               wellbore=wellbore)
#
#         self.service = Service.objects.create(name='Service_1')
#         self.method = Method.objects.create(name='Method_1', method_class='Method_class_1')
#         self.device = Service_device.objects.create(tool_type='Tool_type_1')
#         self.service_method = Service_method.objects.create(service=self.service, service_device=self.device,
#                                                             method=self.method)
#
#         self.inform_for_method_1_attributes = {'service_method': self.service_method, 'tool_num': 'num',
#                                                'calibr_date': '2021-10-10', 'start_date': '2021-10-10',
#                                                'end_date': '2021-10-10',
#                                                'interval_shod_start': 0, 'interval_shod_end': 0,
#                                                'reason_rashod': '', 'petrophysic_task': 0,
#                                                'petrophysic_selected': [],
#                                                'quality_control': self.quality_control}
#
#         self.inform_for_method_1 = Inform_for_method.objects.create(**self.inform_for_method_1_attributes)
#
#         Inform_for_method.objects.create(service_method=self.service_method, tool_num='num', calibr_date='2021-10-10',
#                                          start_date='2021-10-10', end_date='2021-10-10', interval_shod_start=None,
#                                          interval_shod_end=None, reason_rashod='',
#                                          petrophysic_task=None, petrophysic_selected=[],
#                                          quality_control=self.quality_control)
#         self.koef_fail = Koef_fail.objects.create(inform_for_method=self.inform_for_method_1, koef_fail=None)
#         self.koef_shod = Koef_shod.objects.create(inform_for_method=self.inform_for_method_1, koef_shod=None)
#
#         self.serializer_inform_for_method = Inform_for_methodSerializer(instance=self.inform_for_method_1_attributes)
#
#     def test_serializer_contains_expected_fields(self):
#         data = self.serializer_inform_for_method.data
#         set_for_serializer = set(['tool_num', 'calibr_date', 'start_date', 'end_date', 'interval_shod_start',
#                                   'interval_shod_end', 'reason_rashod',
#                                   'petrophysic_task', 'petrophysic_selected'])
#         self.assertEqual(set(data.keys()), set_for_serializer)
#
#         for field_for_serializer in set_for_serializer:
#             self.field_for_serializer_full_inform(field_for_serializer, data)
#
#     def field_for_serializer_full_inform(self, field_for_serializer, data):
#         self.assertEqual(data[field_for_serializer], self.inform_for_method_1_attributes[field_for_serializer])
#
#     def test_model_field_max_length(self):
#         max_length = self.inform_for_method_1._meta.get_field('tool_num').max_length
#         self.assertEquals(max_length, 120)
#         max_length = self.inform_for_method_1._meta.get_field('reason_rashod').max_length
#         self.assertEquals(max_length, 120)
#
#     def test_create_with_wrong_field(self):
#         inform_for_method = Inform_for_method(service_method=self.service_method,
#                                               tool_num='num',
#                                               calibr_date='2021-10-10',
#                                               start_date='2021-10-10', end_date='2021-10-10', interval_shod_start=0,
#                                               interval_shod_end=1,
#                                               reason_rashod='something',
#                                               petrophysic_task=None, petrophysic_selected=[],
#                                               quality_control=self.quality_control)
#         with self.assertRaises(ValidationError):
#             inform_for_method.full_clean()
#
#         inform_for_method.reason_rashod = 'Перерасчет данных из памяти прибора'
#         inform_for_method.petrophysic_task = -1
#
#         with self.assertRaises(ValidationError):
#             inform_for_method.full_clean()
#         inform_for_method.petrophysic_task = 0.1
#
#         self.function_save_test(inform_for_method)
#
#     def function_save_test(self, inform_for_method):
#         inform_for_method.petrophysic_selected = ['Выделение коллекторов', 'Определение характера насыщения',
#                                                   'Определение Кп', 'Определение Кнг', 'Определение литотипа',
#                                                   'something else', 'none']
#         inform_for_method.save()
#
#         self.assertEqual(Inform_for_method.Types_task, inform_for_method.petrophysic_selected)
#
#     def create_inform_for_method(self, quality_control, service_method):
#         return Inform_for_method.objects.create(service_method=service_method, tool_num='inform_created',
#                                                 calibr_date='2021-10-10',
#                                                 start_date='2021-10-10', end_date='2021-10-10',
#                                                 interval_shod_start=None,
#                                                 interval_shod_end=None,
#                                                 reason_rashod='',
#                                                 petrophysic_task=None, petrophysic_selected=[],
#                                                 quality_control=quality_control)
#
#     def create_wellbore_and_quality_control(self):
#         wellbore = Wellbore.objects.create(num_wellbore='num', pie_well='', diametr=None, well=self.well)
#         return Quality_control.objects.create(value=1, density=1, section_interval_start=None,
#                                                                 section_interval_end=None, data_type='',wellbore=wellbore)
#
#     def test_model_inform_for_method_foreign_keys(self):
#         quality_control = self.create_wellbore_and_quality_control()
#         device = Service_device.objects.create(tool_type='Tool_type')
#         service_method = Service_method.objects.create(service=self.service, service_device=device,
#                                                        method=self.method)
#
#         self.assertEqual(self.quality_control, self.inform_for_method_1.quality_control)
#         self.assertEqual(self.service_method, self.inform_for_method_1.service_method)
#
#         inform_for_method = self.create_inform_for_method(quality_control, self.service_method)
#         Koef_fail.objects.create(inform_for_method=inform_for_method, koef_fail=None)
#         Koef_shod.objects.create(inform_for_method=inform_for_method, koef_shod=None)
#
#         quality_control.delete()
#         with self.assertRaises(Inform_for_method.DoesNotExist):
#             Inform_for_method.objects.get(id=inform_for_method.pk)
#
#         with self.assertRaises(ObjectDoesNotExist):
#             Koef_shod.objects.get(inform_for_method=inform_for_method.pk)
#             Koef_fail.objects.get(inform_for_method=inform_for_method.pk)
#
#         inform_for_method = self.create_inform_for_method(self.quality_control, service_method)
#         service_method.delete()
#         with self.assertRaises(Inform_for_method.DoesNotExist):
#             Inform_for_method.objects.get(id=inform_for_method.pk)
#
#     def data_for_view(self):
#         return {'service_method_id': self.service_method.pk, 'tool_num': 'num',
#                 'calibr_date': '2021-10-10', 'start_date': '2021-10-10',
#                 'end_date': '2021-10-10',
#                 'interval_shod_start': 0, 'interval_shod_end': 0,
#                 'reason_rashod': '', 'petrophysic_task': 0,
#                 'petrophysic_selected': ['Определение Кнг']}
#
#     def test_inform_for_method_view_list_create(self):
#         responce_get = self.client.get(reverse('quality.inform_for_method:inform_for_method_list_create_view',
#                                                kwargs={'pk_quality_control': self.quality_control.pk}))
#         inform_for_methods = Inform_for_method.objects.filter(quality_control=self.quality_control.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(Inform_for_methodSerializer(inform_for_method).data for inform_for_method
#                               in inform_for_methods), json.loads(json.dumps(responce_get.data)))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          inform_for_method_views.Inform_for_methodListCreateView.as_view().__name__)
#
#         responce_post = self.client.post(reverse('quality.inform_for_method:inform_for_method_list_create_view',
#                                                  kwargs={'pk_quality_control': self.quality_control.pk}),
#                                          self.data_for_view())
#         post_data = json.loads(json.dumps(responce_post.data))
#         self.field_check(self.data_for_view(), post_data)
#
#         self.assertEqual(201, responce_post.status_code)
#         self.assertEqual(responce_post.resolver_match.func.__name__,
#                          inform_for_method_views.Inform_for_methodListCreateView.as_view().__name__)
#
#     def test_single_witsml_view(self):
#         responce_get = self.client.get(reverse('quality.inform_for_method:single_inform_for_method_view',
#                                                kwargs={'pk': self.inform_for_method_1.pk}))
#         inform_for_method_get = Inform_for_method.objects.get(id=self.inform_for_method_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(Inform_for_methodSerializer(inform_for_method_get).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          inform_for_method_views.SingleInform_for_methodView.as_view().__name__)
#
#         inform_for_method = self.create_inform_for_method(self.quality_control, self.service_method)
#         # data_put = self.data_for_view()
#         # responce_put = self.client.put(reverse('quality.inform_for_method:single_inform_for_method_view',
#         #                                        kwargs={'pk': inform_for_method.pk}), data_put)
#         # self.assertEqual(200, responce_put.status_code)
#         # self.assertNotEqual(Inform_for_methodSerializer(inform_for_method).data, dict(responce_put.data))
#         # self.assertEqual(responce_put.resolver_match.func.__name__,
#         #                  inform_for_method_views.SingleInform_for_methodView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('quality.inform_for_method:single_inform_for_method_view',
#                                                      kwargs={'pk': inform_for_method.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          inform_for_method_views.SingleInform_for_methodView.as_view().__name__)
#         with self.assertRaises(Inform_for_method.DoesNotExist):
#             Inform_for_method.objects.get(id=inform_for_method.pk)
#
#     def data_put_post_inform_method_second_table(self, inform_for_method_id):
#         return f'{{"service_id": {self.service.pk}, "inform_for_method": [{{"id": {inform_for_method_id}, ' \
#                '"tool_num": "inform_changed", "interval_shod_start": 0, "interval_shod_end": 1,' \
#                '"reason_rashod": "", "petrophysic_task": 0,' \
#                '"petrophysic_selected": ["Определение литотипа"],' \
#                f'"koef_fail": 0, "koef_shod": 0, "service_device_id": {self.device.pk},' \
#                f'"method_id": {self.method.pk}}}],' \
#                f'"second_table": [{{"inform_for_method_id": {inform_for_method_id}, "act": "", "linkage": "",' \
#                '"emissions": "", "noise": "", "control": "", "distribute_support": "",' \
#                '"distribute_palet": "", "dash": "", "corresponse": "", "correlation": 0,' \
#                f'"device_tech_condition": ""}}]}}'
#
#     def second_table_create(self, inform_for_method):
#         return Second_table.objects.create(inform_for_method=inform_for_method, act='', linkage='',
#                                            emissions='', noise='', control='', distribute_support='',
#                                            distribute_palet='', dash='', corresponse='', correlation=0,
#                                            device_tech_condition='')
#
#     def field_check(self, changed_dict, old_dict):
#         for key in changed_dict:
#             if key in old_dict:
#                 self.assertEqual(changed_dict[key], old_dict[key])
#
#     def test_put_post_inform_method_second_table(self):
#         quality_control = self.create_wellbore_and_quality_control()
#         inform_for_method = self.create_inform_for_method(quality_control, self.service_method)
#         second_table = self.second_table_create(inform_for_method)
#
#         data_change = self.data_put_post_inform_method_second_table(inform_for_method.pk)
#
#         responce_put = self.client.put(reverse('quality.inform_for_method:put_post_inform_method_second_table',
#                                                kwargs={'pk_quality_control': quality_control.pk}), data_change,
#                                        content_type="application/json")
#
#         self.assertEqual(200, responce_put.status_code)
#         self.assertEqual('OK', responce_put.data)
#
#         inform_for_method_dict = Inform_for_methodSerializer(Inform_for_method.objects.get(
#             id=inform_for_method.pk)).data
#         inform_for_method_changed = json.loads(data_change)['inform_for_method'][0]
#         self.field_check(inform_for_method_changed, inform_for_method_dict)
#
#         second_table_dict = Second_tableSerializer(Second_table.objects.get(
#             inform_for_method=inform_for_method.pk)).data
#         second_table_changed = json.loads(data_change)['second_table'][0]
#         self.field_check(second_table_changed, second_table_dict)
#
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          inform_for_method_views.PutAndPostView.as_view().__name__)
#
#     def test_koef_fail_create_view(self):
#         inform_for_method = self.create_inform_for_method(self.quality_control, self.service_method)
#
#         data = {'koef_fail': 0}
#
#         responce_post = self.client.post(reverse('quality.inform_for_method:koef_fail_create_view',
#                                                  kwargs={'pk_inform_for_method': inform_for_method.pk}), data)
#         koef_fail = Koef_fail.objects.get(inform_for_method=inform_for_method.pk)
#         self.assertEqual(201, responce_post.status_code)
#         self.assertEqual(Koef_failSerializer(koef_fail).data, json.loads(json.dumps(responce_post.data)))
#         self.assertEqual(responce_post.resolver_match.func.__name__,
#                          inform_for_method_views.Koef_failCreateView.as_view().__name__)
#
#     def test_koef_shod_create_view(self):
#         inform_for_method = self.create_inform_for_method(self.quality_control, self.service_method)
#
#         data = {'koef_shod': 0}
#
#         responce_post = self.client.post(reverse('quality.inform_for_method:koef_shod_create_view',
#                                                  kwargs={'pk_inform_for_method': inform_for_method.pk}), data)
#         koef_shod = Koef_shod.objects.get(inform_for_method=inform_for_method.pk)
#         self.assertEqual(201, responce_post.status_code)
#         self.assertEqual(Koef_shodSerializer(koef_shod).data, json.loads(json.dumps(responce_post.data)))
#         self.assertEqual(responce_post.resolver_match.func.__name__,
#                          inform_for_method_views.Koef_shodCreateView.as_view().__name__)
#
#     def test_koef_fail_list_view(self):
#         responce_get = self.client.get('/api/koef_fail/')
#         koef_fails = Koef_fail.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(koef_fails), list(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          inform_for_method_views.Koef_failView.as_view().__name__)
#
#     def test_koef_shod_list_view(self):
#         responce_get = self.client.get('/api/koef_shod/')
#         koef_shods = Koef_shod.objects.all().values()
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(list(koef_shods), list(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          inform_for_method_views.Koef_shodView.as_view().__name__)
#
#     def test_single_koef_fail_view(self):
#         responce_get = self.client.get(reverse('quality.inform_for_method:single_koef_fail_view',
#                                                kwargs={'pk': self.inform_for_method_1.pk}))
#         koef_fail = Koef_fail.objects.get(inform_for_method=self.inform_for_method_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(Koef_failSerializer(koef_fail).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          inform_for_method_views.SingleKoef_failView.as_view().__name__)
#
#         inform_for_method = self.create_inform_for_method(self.quality_control, self.service_method)
#
#         koef_fail = Koef_fail.objects.create(inform_for_method=inform_for_method, koef_fail=0)
#         responce_put = self.client.put(reverse('quality.inform_for_method:single_koef_fail_view',
#                                                kwargs={'pk': inform_for_method.pk}), {'koef_fail': 1})
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(Koef_failSerializer(koef_fail).data, dict(responce_put.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          inform_for_method_views.SingleKoef_failView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('quality.inform_for_method:single_koef_fail_view',
#                                                      kwargs={'pk': inform_for_method.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          inform_for_method_views.SingleKoef_failView.as_view().__name__)
#         with self.assertRaises(Koef_fail.DoesNotExist):
#             Koef_fail.objects.get(inform_for_method=inform_for_method.pk)
#         inform_for_method.delete()
#
#     def test_single_koef_shod_view(self):
#         responce_get = self.client.get(reverse('quality.inform_for_method:single_koef_shod_view',
#                                                kwargs={'pk': self.inform_for_method_1.pk}))
#         koef_shod = Koef_shod.objects.get(inform_for_method=self.inform_for_method_1.pk)
#         self.assertEqual(200, responce_get.status_code)
#         self.assertEqual(Koef_shodSerializer(koef_shod).data, dict(responce_get.data))
#         self.assertEqual(responce_get.resolver_match.func.__name__,
#                          inform_for_method_views.SingleKoef_shodView.as_view().__name__)
#
#         inform_for_method = self.create_inform_for_method(self.quality_control, self.service_method)
#
#         koef_shod = Koef_shod.objects.create(inform_for_method=inform_for_method, koef_shod=0)
#         responce_put = self.client.put(reverse('quality.inform_for_method:single_koef_shod_view',
#                                                kwargs={'pk': inform_for_method.pk}), {'koef_shod': 1})
#         self.assertEqual(200, responce_put.status_code)
#         self.assertNotEqual(Koef_shodSerializer(koef_shod).data, dict(responce_put.data))
#         self.assertEqual(responce_put.resolver_match.func.__name__,
#                          inform_for_method_views.SingleKoef_shodView.as_view().__name__)
#
#         responce_delete = self.client.delete(reverse('quality.inform_for_method:single_koef_shod_view',
#                                                      kwargs={'pk': inform_for_method.pk}))
#         self.assertEqual(204, responce_delete.status_code)
#         self.assertEqual(responce_delete.resolver_match.func.__name__,
#                          inform_for_method_views.SingleKoef_shodView.as_view().__name__)
#         with self.assertRaises(Koef_shod.DoesNotExist):
#             Koef_shod.objects.get(inform_for_method=inform_for_method.pk)
#         inform_for_method.delete()
#
#     # def data_for_second_table(self, service_methods_device, pk):
#     #     second_table = SecondTableFullGetServices()
#     #     second_table.second_table(pk)
#     #     second_table_data = second_table.data
#     #     second_table_data.update(service_methods_device)
#     #     return second_table_data
#     #
#     # def data_for_second_table_inform_for_method(self, quality_control_pk, service_logic):
#     #     inform_for_methods = Inform_for_method.objects.filter(quality_control=quality_control_pk)
#     #     methods_data = []
#     #     second_table_dict = []
#     #     for inform_for_method in inform_for_methods.values():
#     #         koef_fail = service_logic.koef_fail(inform_for_method['id'])
#     #         if koef_fail:
#     #             inform_for_method.update(koef_fail)
#     #         koef_shod = service_logic.koef_shod(inform_for_method['id'])
#     #         if koef_shod:
#     #             inform_for_method.update(koef_shod)
#     #         service_methods_device = service_logic.get_method_device(inform_for_method['service_method_id'])
#     #         inform_for_method.update(service_methods_device)
#     #         second_table = service_logic.get_second_table(inform_for_method['id'], service_methods_device)
#     #         if second_table:
#     #             second_table_dict = second_table_dict + [second_table]
#     #         service_logic.get_second_table(inform_for_method['id'], service_methods_device)
#     #         [inform_for_method.pop(key, None) for key in ['quality_control_id', 'service_method_id']]
#     #         methods_data = methods_data + [inform_for_method]
#     #     return methods_data, second_table_dict
#     #
#     # def test_service(self):
#     #     service_logic = InformMethodFullGetServices()
#     #     self.assertEqual(None, service_logic.exception)
#     #     self.assertFalse(any(service_logic.methods_data))
#     #     self.assertFalse(any(service_logic.second_tables))
#     #     self.assertFalse(any(service_logic.service))
#     #
#     #     # device = Service_device.objects.create(tool_type='Tool_type')
#     #     # service_method = Service_method.objects.create(service=self.service, service_device=device,
#     #     #                                                method=self.method)
#     #     # create_wellbore_and_quality_control
#     #
#     #     service_logic.get_inform_for_method(self.quality_control.pk)
#     #     methods_data, second_table_dict = \
#     #         self.data_for_second_table_inform_for_method(self.quality_control.pk, service_logic)
#     #
#     #     self.assertEqual(methods_data, service_logic.methods_data)
#     #     self.assertEqual(second_table_dict, service_logic.second_tables)
