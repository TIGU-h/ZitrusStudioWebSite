<?php
/**
 * Local variables.
 *
 * @var array $grouped_timezones
 */
?>

<div id="wizard-frame-4" class="wizard-frame p-3 p-md-4" style="display:none;">
    <div class="frame-container py-3" style="min-height: 500px;">

        <h2 class="frame-title fw-light text-center mb-4 text-muted"><?= lang('appointment_date_and_time') ?></h2>

        <div class="row frame-content">
            <div class="col-12 col-lg-6">
                <div id="select-date" class="mx-auto my-4"></div>

            </div>

            <div class="col-12 col-lg-6">
                <div id="select-time" class="mx-auto py-3" style="max-width: 288px;">
                    <div class="mb-3">
                        <label for="select-timezone" class="form-label">
                            <?= lang('timezone') ?>
                        </label>
                        <?php component('timezone_dropdown', [
                            'attributes' => 'id="select-timezone" class="form-select mb-3" value="UTC"',
                            'grouped_timezones' => $grouped_timezones,
                        ]); ?>
                    </div>

                    <div id="available-hours" class="overflow-auto my-3 pe-2" style="max-height: 250px;"></div>

                </div>
            </div>
        </div>
    </div>

    <div class="command-buttons text-center my-3 mx-auto d-md-flex justify-content-md-between">
        <button type="button" id="button-back-4" class="btn button-back btn-outline-secondary"
                data-step_index="4">
            <i class="fas fa-chevron-left me-2"></i>
            <?= lang('back') ?>
        </button>
        <button type="button" id="button-next-4" class="btn button-next btn-dark"
                data-step_index="4">
            <?= lang('next') ?>
            <i class="fas fa-chevron-right ms-2"></i>
        </button>
    </div>
</div>
