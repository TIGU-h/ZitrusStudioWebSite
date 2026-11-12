<?php defined('BASEPATH') or exit('No direct script access allowed');

/* ----------------------------------------------------------------------------
 * Easy!Appointments - Online Appointment Scheduler
 *
 * @package     EasyAppointments
 * @license     https://opensource.org/licenses/GPL-3.0 - GPLv3
 * ---------------------------------------------------------------------------- */

class Migration_Add_image_url_columns_to_services_and_categories extends CI_Migration
{
    /**
     * Upgrade method.
     */
    public function up(): void
    {
        $this->db->query(
            'ALTER TABLE `' . $this->db->dbprefix('services') . '` ADD `image_url` VARCHAR(2048) NULL',
        );
        $this->db->query(
            'ALTER TABLE `' . $this->db->dbprefix('service_categories') . '` ADD `image_url` VARCHAR(2048) NULL',
        );
    }

    /**
     * Downgrade method.
     */
    public function down(): void
    {
        $this->db->query('ALTER TABLE `' . $this->db->dbprefix('services') . '` DROP COLUMN `image_url`');
        $this->db->query(
            'ALTER TABLE `' . $this->db->dbprefix('service_categories') . '` DROP COLUMN `image_url`',
        );
    }
}
